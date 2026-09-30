"""
Migración de datos desde el Excel de Eficiencias directamente a SQLite.

Lee "Eficiencias Propósito General_2026_v_0.2.xlsx" (o la versión indicada) y
puebla la base `eficiencias.db` usando el esquema de `create_schema.sql`.

A diferencia de `migrate_data.py` (que lee JSON intermedios con posiciones de
columna fijas), este script detecta dinámicamente las columnas de año en cada
hoja, por lo que soporta vigencias nuevas (p. ej. 2026) sin cambios de código.

Uso:
    python migrate_from_excel.py                 # genera src/assets/db/eficiencias.db
    python migrate_from_excel.py --out otro.db   # genera en otra ruta (para validar)
    python migrate_from_excel.py --excel "ruta.xlsx"
"""

import argparse
import logging
import os
import re
import sqlite3
from datetime import datetime

import openpyxl

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DB_DIR = os.path.join(PROJECT_ROOT, 'src', 'assets', 'db')
DEFAULT_EXCEL = os.path.join(DB_DIR, 'Eficiencias Propósito General_2026_v_0.2.xlsx')
DEFAULT_DB = os.path.join(DB_DIR, 'eficiencias.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'create_schema.sql')

# Nombres de hoja (respetando acentos)
SHEETS = {
    'ingresos': 'Datos_Ingresos_Tributarios',
    'poblacion': 'Datos_Población',
    'recursos': 'Recursos',
    'ef_admin': 'Ef_Admin',
    'ley_550': 'Indicadores_Ley 550',
    'nbi': 'NBI',
}

HEADER_ROW = 2  # fila (0-based) con los encabezados en todas las hojas de datos
DANE_RE = re.compile(r'^\d{4,5}$')


def clean_num(v):
    """Devuelve float o None. Vacíos y no numéricos -> None."""
    if v is None or v == '':
        return None
    if isinstance(v, str):
        v = v.strip().replace(',', '')
        if v == '':
            return None
        try:
            return float(v)
        except ValueError:
            return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def is_dane(v):
    if v is None:
        return False
    s = str(v).strip()
    if s.endswith('.0'):
        s = s[:-2]
    return bool(DANE_RE.match(s))


def norm_dane(v):
    s = str(v).strip()
    if s.endswith('.0'):
        s = s[:-2]
    return s.zfill(5)


def year_columns(header_row):
    """[(col_idx, año)] para celdas de encabezado que son un año 20xx."""
    out = []
    for idx, val in enumerate(header_row):
        if idx < 3 or val is None:
            continue
        s = str(val).strip()
        if re.fullmatch(r'20\d\d', s):
            out.append((idx, int(s)))
    return out


class ExcelMigrator:
    def __init__(self, excel_path, db_path):
        self.excel_path = excel_path
        self.db_path = db_path
        self.conn = None
        self.wb = None
        self.municipios = set()

    def connect(self):
        if os.path.exists(self.db_path):
            logger.info(f'Eliminando BD existente: {self.db_path}')
            os.remove(self.db_path)
        self.conn = sqlite3.connect(self.db_path)
        self.conn.execute('PRAGMA foreign_keys = ON')
        with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
            self.conn.executescript(f.read())
        self.conn.commit()
        logger.info('Esquema creado')

    def load_excel(self):
        logger.info(f'Abriendo Excel: {self.excel_path}')
        self.wb = openpyxl.load_workbook(self.excel_path, read_only=True, data_only=True)

    def rows(self, sheet):
        return list(self.wb[sheet].iter_rows(values_only=True))

    def add_muni(self, dane, depto, muni):
        if dane in self.municipios:
            return
        self.conn.execute(
            'INSERT OR IGNORE INTO municipios (codigo_dane, departamento, municipio) VALUES (?, ?, ?)',
            (dane, str(depto).strip() if depto else '', str(muni).strip() if muni else '')
        )
        self.municipios.add(dane)

    # ---- Hojas simples (serie por año) --------------------------------------
    def migrate_ingresos(self):
        rows = self.rows(SHEETS['ingresos'])
        header = rows[HEADER_ROW]
        years = year_columns(header)
        # columna OBSERVACIÓN (última no-año), si existe
        obs_idx = None
        for idx, val in enumerate(header):
            if val is not None and 'OBSERV' in str(val).upper():
                obs_idx = idx
        n = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            obs = str(row[obs_idx]) if (obs_idx is not None and row[obs_idx] not in (None, '')) else None
            for col, year in years:
                self.conn.execute(
                    'INSERT OR IGNORE INTO ingresos_tributarios (codigo_dane, anio, valor, observacion) VALUES (?, ?, ?, ?)',
                    (dane, year, clean_num(row[col]), obs)
                )
                n += 1
        self.conn.commit()
        logger.info(f'ingresos_tributarios: {n} registros')

    def migrate_poblacion(self):
        rows = self.rows(SHEETS['poblacion'])
        years = year_columns(rows[HEADER_ROW])
        n = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            for col, year in years:
                val = clean_num(row[col])
                val = None if (val is None or val == 0) else int(val)
                fuente = '2005' if year <= 2017 else '2018'
                self.conn.execute(
                    'INSERT OR IGNORE INTO poblacion (codigo_dane, anio, poblacion, fuente_censo) VALUES (?, ?, ?, ?)',
                    (dane, year, val, fuente)
                )
                n += 1
        self.conn.commit()
        logger.info(f'poblacion: {n} registros')

    def migrate_nbi(self):
        rows = self.rows(SHEETS['nbi'])
        years = year_columns(rows[HEADER_ROW])
        n = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            for col, year in years:
                self.conn.execute(
                    'INSERT OR IGNORE INTO nbi (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                    (dane, year, clean_num(row[col]))
                )
                n += 1
        self.conn.commit()
        logger.info(f'nbi: {n} registros')

    # ---- Recursos (metric_año) ----------------------------------------------
    def migrate_recursos(self):
        rows = self.rows(SHEETS['recursos'])
        header = rows[HEADER_ROW]
        # metric normalizada -> {año: col}
        metric_map = {}
        for idx, val in enumerate(header):
            if idx < 3 or val is None:
                continue
            s = str(val).strip()
            m = re.match(r'^(.*)_(20\d\d)$', s)
            if not m:
                continue
            metric = m.group(1).strip().lower()
            year = int(m.group(2))
            metric_map.setdefault(year, {})[metric] = idx

        def g(row, cols, key):
            idx = cols.get(key)
            return clean_num(row[idx]) if idx is not None else None

        n = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            for year, cols in sorted(metric_map.items()):
                pob_m = g(row, cols, 'población_m')
                pobr_m = g(row, cols, 'pobreza_m')
                pob = g(row, cols, 'población')
                pobr = g(row, cols, 'pobreza')
                ef = g(row, cols, 'eficiencia fiscal')
                ea = g(row, cols, 'eficiencia administrativa')
                sis = g(row, cols, 'sisben')
                pob_m = None if pob_m == 0 else pob_m
                pob = None if pob == 0 else pob
                self.conn.execute(
                    '''INSERT OR IGNORE INTO recursos_proposito_general
                       (codigo_dane, anio, poblacion_m, pobreza_m, poblacion, pobreza,
                        eficiencia_fiscal, eficiencia_administrativa, sisben)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (dane, year, pob_m, pobr_m, pob, pobr, ef, ea, sis)
                )
                n += 1
        self.conn.commit()
        logger.info(f'recursos_proposito_general: {n} registros')

    # ---- Ef_Admin (multi-bloque) --------------------------------------------
    def _year_blocks(self, header):
        """Agrupa columnas de año consecutivas en bloques [(años:[(col,año)])]."""
        blocks = []
        current = []
        for idx, val in enumerate(header):
            if idx < 3 or val is None:
                if current:
                    blocks.append(current)
                    current = []
                continue
            s = str(val).strip()
            if re.fullmatch(r'20\d\d', s):
                current.append((idx, int(s)))
            else:
                if current:
                    blocks.append(current)
                    current = []
        if current:
            blocks.append(current)
        return blocks

    def migrate_ef_admin(self):
        rows = self.rows(SHEETS['ef_admin'])
        header = rows[HEADER_ROW]
        blocks = self._year_blocks(header)
        # Orden esperado: 0=ICLD, 1=GF, 2=Razón, 3=Holgura
        icld_b, gf_b, razon_b, holg_b = blocks[0], blocks[1], blocks[2], blocks[3]
        # Límite de Gasto y Vigencia 2026 por nombre de encabezado
        limite_idx = None
        vig_idx = {}
        for idx, val in enumerate(header):
            if val is None:
                continue
            s = str(val).strip().lower()
            if s == 'límite de gasto':
                limite_idx = idx
            elif s == 'icld':
                vig_idx['icld'] = idx
            elif s == 'gf':
                vig_idx['gf'] = idx
            elif s == 'lg':
                vig_idx['lg'] = idx
            elif s == 'razón':
                vig_idx['razon'] = idx
            elif s == 'holgura':
                vig_idx['holgura'] = idx

        c_icld = c_gf = c_razon = c_holg = c_lim = c_v = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            for col, year in icld_b:
                self.conn.execute('INSERT OR IGNORE INTO ley_617_icld (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, clean_num(row[col]))); c_icld += 1
            for col, year in gf_b:
                self.conn.execute('INSERT OR IGNORE INTO ley_617_gastos_funcionamiento (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, clean_num(row[col]))); c_gf += 1
            for col, year in razon_b:
                v = clean_num(row[col]); v = None if v == 0 else v
                self.conn.execute('INSERT OR IGNORE INTO ley_617_razon (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, v)); c_razon += 1
            for col, year in holg_b:
                v = clean_num(row[col]); v = None if v == 0 else v
                self.conn.execute('INSERT OR IGNORE INTO ley_617_holgura (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, v)); c_holg += 1
            if limite_idx is not None:
                self.conn.execute('INSERT OR IGNORE INTO ley_617_limite_gasto (codigo_dane, limite_gasto) VALUES (?, ?)',
                                  (dane, clean_num(row[limite_idx]))); c_lim += 1
            if len(vig_idx) == 5:
                self.conn.execute(
                    '''INSERT OR IGNORE INTO ley_617_vigencia_2026 (codigo_dane, icld, gf, lg, razon, holgura)
                       VALUES (?, ?, ?, ?, ?, ?)''',
                    (dane, clean_num(row[vig_idx['icld']]), clean_num(row[vig_idx['gf']]),
                     clean_num(row[vig_idx['lg']]), clean_num(row[vig_idx['razon']]),
                     clean_num(row[vig_idx['holgura']]))); c_v += 1
        self.conn.commit()
        logger.info(f'ley_617: icld={c_icld} gf={c_gf} razon={c_razon} holgura={c_holg} limite={c_lim} vig2026={c_v}')

    # ---- Indicadores Ley 550 (EF + EA) --------------------------------------
    def migrate_indicadores(self):
        rows = self.rows(SHEETS['ley_550'])
        header = rows[HEADER_ROW]
        blocks = self._year_blocks(header)
        ef_b, ea_b = blocks[0], blocks[1]
        c_ef = c_ea = 0
        for row in rows[HEADER_ROW + 1:]:
            if not is_dane(row[0]):
                continue
            dane = norm_dane(row[0])
            self.add_muni(dane, row[1], row[2])
            for col, year in ef_b:
                v = clean_num(row[col]); v = None if v == 0 else v
                self.conn.execute('INSERT OR IGNORE INTO indicadores_eficiencia_fiscal (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, v)); c_ef += 1
            for col, year in ea_b:
                v = clean_num(row[col]); v = None if v == 0 else v
                self.conn.execute('INSERT OR IGNORE INTO indicadores_eficiencia_administrativa (codigo_dane, anio, valor) VALUES (?, ?, ?)',
                                  (dane, year, v)); c_ea += 1
        self.conn.commit()
        logger.info(f'indicadores: ef={c_ef} ea={c_ea}')

    def update_metadata(self):
        cur = self.conn.execute('SELECT COUNT(*) FROM municipios')
        total = cur.fetchone()[0]
        for k, v in [('version', '2.0-excel'),
                     ('origen', os.path.basename(self.excel_path)),
                     ('fecha_migracion', datetime.now().isoformat()),
                     ('total_municipios', str(total))]:
            self.conn.execute('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', (k, v))
        self.conn.commit()
        logger.info(f'Municipios: {total}')

    def run(self):
        self.load_excel()
        self.connect()
        self.migrate_ingresos()
        self.migrate_poblacion()
        self.migrate_recursos()
        self.migrate_ef_admin()
        self.migrate_indicadores()
        self.migrate_nbi()
        self.update_metadata()
        self.conn.close()
        logger.info(f'Migración completada: {self.db_path}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--excel', default=DEFAULT_EXCEL)
    ap.add_argument('--out', default=DEFAULT_DB)
    args = ap.parse_args()
    ExcelMigrator(args.excel, args.out).run()


if __name__ == '__main__':
    main()
