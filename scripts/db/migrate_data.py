"""
Script de migración de datos JSON a SQLite
Convierte los archivos JSON de Eficiencias_hojas a base de datos relacional normalizada
"""

import json
import sqlite3
import logging
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import config

# Configurar logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT
)
logger = logging.getLogger(__name__)


class DataMigrator:
    """Clase principal para migración de datos JSON a SQLite"""

    def __init__(self):
        self.conn: Optional[sqlite3.Connection] = None
        self.municipios_cache = set()

    def connect_db(self):
        """Conectar a la base de datos SQLite"""
        # Eliminar BD existente si existe
        if os.path.exists(config.DB_PATH):
            logger.info(f"Eliminando base de datos existente: {config.DB_PATH}")
            os.remove(config.DB_PATH)

        # Crear conexión
        logger.info(f"Creando base de datos en: {config.DB_PATH}")
        self.conn = sqlite3.connect(config.DB_PATH)
        self.conn.execute("PRAGMA foreign_keys = ON")

    def create_schema(self):
        """Ejecutar script SQL de creación de esquema"""
        logger.info("Creando esquema de base de datos...")

        with open(config.SCHEMA_PATH, 'r', encoding='utf-8') as f:
            schema_sql = f.read()

        self.conn.executescript(schema_sql)
        self.conn.commit()
        logger.info("Esquema creado exitosamente")

    def parse_json_file(self, filepath: str) -> Dict[str, Any]:
        """Leer y parsear archivo JSON"""
        logger.info(f"Leyendo archivo: {filepath}")

        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Archivo no encontrado: {filepath}")

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        logger.info(f"Archivo parseado: {len(data.get('rows', []))} filas")
        return data

    def insert_municipio(self, codigo_dane: str, departamento: str, municipio: str):
        """Insertar municipio en catálogo (si no existe)"""
        if codigo_dane in self.municipios_cache:
            return

        try:
            self.conn.execute(
                "INSERT OR IGNORE INTO municipios (codigo_dane, departamento, municipio) VALUES (?, ?, ?)",
                (codigo_dane, departamento, municipio)
            )
            self.municipios_cache.add(codigo_dane)
        except Exception as e:
            logger.error(f"Error insertando municipio {codigo_dane}: {e}")

    def validate_value(self, table: str, column: str, value: Any) -> Optional[Any]:
        """Validar y normalizar valores según contexto de tabla/columna"""

        # Valores vacíos → NULL
        if value == '' or value is None:
            return None

        # Convertir a número si es string numérico
        if isinstance(value, str):
            try:
                # Intentar convertir a float
                value = float(value.replace(',', ''))
            except (ValueError, AttributeError):
                return None

        # Validaciones específicas por tabla
        # Población: 0 es error de datos → NULL
        if table == 'poblacion' and column == 'poblacion':
            return None if value == 0 else int(value) if value else None

        # Indicadores y razones: 0.0 indica dato no disponible → NULL
        if table in ['ley_617_razon', 'ley_617_holgura',
                     'indicadores_eficiencia_fiscal',
                     'indicadores_eficiencia_administrativa']:
            return None if value == 0 or value == 0.0 else value

        # Recursos: poblaciones de 0 → NULL
        if table == 'recursos_proposito_general':
            if column in ['poblacion', 'poblacion_m']:
                return None if value == 0 else value

        return value

    def migrate_ingresos_tributarios(self):
        """Migrar datos de ingresos tributarios"""
        logger.info("Migrando ingresos_tributarios...")

        data = self.parse_json_file(config.JSON_FILES['ingresos_tributarios'])
        rows = data.get('rows', [])

        if not rows:
            logger.warning("No se encontraron filas en ingresos_tributarios")
            return

        headers = rows[0]
        count = 0

        # Encontrar índices de columnas
        idx_codigo = 0
        idx_depto = 1
        idx_municipio = 2
        idx_observacion = len(headers) - 1

        # Años: columnas 3 hasta penúltima
        years = headers[3:idx_observacion]

        for row in rows[1:]:
            codigo_dane = str(row[idx_codigo]).strip()
            departamento = str(row[idx_depto]).strip()
            municipio = str(row[idx_municipio]).strip()
            observacion = str(row[idx_observacion]) if row[idx_observacion] else None

            # Insertar municipio
            self.insert_municipio(codigo_dane, departamento, municipio)

            # Insertar datos por año
            for i, year_str in enumerate(years):
                try:
                    year = int(year_str)
                    valor = self.validate_value('ingresos_tributarios', 'valor', row[3 + i])

                    self.conn.execute(
                        """INSERT INTO ingresos_tributarios
                           (codigo_dane, anio, valor, observacion)
                           VALUES (?, ?, ?, ?)""",
                        (codigo_dane, year, valor, observacion)
                    )
                    count += 1
                except Exception as e:
                    logger.error(f"Error en ingreso tributario {codigo_dane}/{year}: {e}")

        self.conn.commit()
        logger.info(f"Insertados {count} registros en ingresos_tributarios")

    def migrate_poblacion(self):
        """Migrar datos de población"""
        logger.info("Migrando poblacion...")

        data = self.parse_json_file(config.JSON_FILES['poblacion'])
        rows = data.get('rows', [])

        if not rows:
            logger.warning("No se encontraron filas en poblacion")
            return

        headers = rows[0]
        count = 0

        # Encontrar índices de columnas
        idx_codigo = 0
        idx_depto = 1
        idx_municipio = 2

        # Años: desde columna 3 en adelante
        years = headers[3:]

        for row in rows[1:]:
            codigo_dane = str(row[idx_codigo]).strip()
            departamento = str(row[idx_depto]).strip()
            municipio = str(row[idx_municipio]).strip()

            # Insertar municipio
            self.insert_municipio(codigo_dane, departamento, municipio)

            # Insertar datos por año
            for i, year_str in enumerate(years):
                try:
                    year = int(year_str)
                    poblacion_val = self.validate_value('poblacion', 'poblacion', row[3 + i])

                    # Determinar fuente de censo
                    fuente_censo = '2005' if year <= 2017 else '2018'

                    self.conn.execute(
                        """INSERT INTO poblacion
                           (codigo_dane, anio, poblacion, fuente_censo)
                           VALUES (?, ?, ?, ?)""",
                        (codigo_dane, year, poblacion_val, fuente_censo)
                    )
                    count += 1
                except Exception as e:
                    logger.error(f"Error en población {codigo_dane}/{year}: {e}")

        self.conn.commit()
        logger.info(f"Insertados {count} registros en poblacion")

    def migrate_recursos(self):
        """Migrar recursos de propósito general (estructura compleja)"""
        logger.info("Migrando recursos_proposito_general...")

        data = self.parse_json_file(config.JSON_FILES['recursos'])
        rows = data.get('rows', [])

        if not rows:
            logger.warning("No se encontraron filas en recursos")
            return

        headers = rows[0]
        count = 0

        # Mapear columnas por año
        # Patrón: {métrica}_{año}
        metrics_by_year = {}

        for idx, header in enumerate(headers[3:], start=3):  # Saltar CÓDIGO DANE, DEPARTAMENTO, MUNICIPIO
            if '_' in str(header):
                parts = str(header).rsplit('_', 1)
                if len(parts) == 2:
                    metric_name = parts[0].strip().lower().replace(' ', '_')
                    year_str = parts[1]

                    try:
                        year = int(year_str)
                        if year not in metrics_by_year:
                            metrics_by_year[year] = {}
                        metrics_by_year[year][metric_name] = idx
                    except ValueError:
                        continue

        for row in rows[1:]:
            codigo_dane = str(row[0]).strip()
            departamento = str(row[1]).strip()
            municipio = str(row[2]).strip()

            # Insertar municipio
            self.insert_municipio(codigo_dane, departamento, municipio)

            # Insertar datos por año
            for year, metrics in sorted(metrics_by_year.items()):
                try:
                    poblacion_m = self.validate_value('recursos_proposito_general', 'poblacion_m',
                                                      row[metrics.get('población_m', 0)])
                    pobreza_m = self.validate_value('recursos_proposito_general', 'pobreza_m',
                                                    row[metrics.get('pobreza_m', 0)])
                    poblacion = self.validate_value('recursos_proposito_general', 'poblacion',
                                                    row[metrics.get('población', 0)])
                    pobreza = self.validate_value('recursos_proposito_general', 'pobreza',
                                                  row[metrics.get('pobreza', 0)])
                    eficiencia_fiscal = self.validate_value('recursos_proposito_general', 'eficiencia_fiscal',
                                                            row[metrics.get('eficiencia_fiscal', 0)])
                    eficiencia_admin = self.validate_value('recursos_proposito_general', 'eficiencia_administrativa',
                                                          row[metrics.get('eficiencia_administrativa', 0)])
                    sisben = self.validate_value('recursos_proposito_general', 'sisben',
                                                 row[metrics.get('sisben', 0)])

                    self.conn.execute(
                        """INSERT INTO recursos_proposito_general
                           (codigo_dane, anio, poblacion_m, pobreza_m, poblacion, pobreza,
                            eficiencia_fiscal, eficiencia_administrativa, sisben)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        (codigo_dane, year, poblacion_m, pobreza_m, poblacion, pobreza,
                         eficiencia_fiscal, eficiencia_admin, sisben)
                    )
                    count += 1
                except Exception as e:
                    logger.error(f"Error en recursos {codigo_dane}/{year}: {e}")

        self.conn.commit()
        logger.info(f"Insertados {count} registros en recursos_proposito_general")

    def migrate_ef_admin(self):
        """Migrar datos de Ef_Admin.json (estructura multi-bloque)"""
        logger.info("Migrando datos de Ley 617 (Ef_Admin.json)...")

        data = self.parse_json_file(config.JSON_FILES['ef_admin'])
        rows = data.get('rows', [])

        if not rows:
            logger.warning("No se encontraron filas en ef_admin")
            return

        headers = rows[0]

        # Identificar posiciones de bloques buscando "CÓDIGO DANE" en headers
        # Estructura real del archivo:
        # [CÓDIGO DANE, DEPARTAMENTO, MUNICIPIO, 2016-2023, CÓDIGO DANE (sep), 2016-2023, ...]
        # Posiciones 0-2: CÓDIGO DANE, DEPARTAMENTO, MUNICIPIO
        # Posiciones 3-10: 2016-2023 (ICLD)
        # Posición 11: CÓDIGO DANE (separador - IGNORAR)
        # Posiciones 12-19: 2016-2023 (Gastos Funcionamiento)
        # Posición 20: CÓDIGO DANE (separador - IGNORAR)
        # Posiciones 21-28: 2016-2023 (Razón)
        # Posición 29: CÓDIGO DANE (separador - IGNORAR)
        # Posiciones 30-37: 2016-2023 (Holgura)
        # Posición 38: Límite de Gasto
        # Posición 39: CÓDIGO DANE (separador - IGNORAR)
        # Posiciones 40-44: ICLD, GF, LG, Razón, Holgura (Vigencia 2026)

        years_617 = list(range(2016, 2024))  # 2016-2023
        count_icld = 0
        count_gf = 0
        count_razon = 0
        count_holgura = 0
        count_limite = 0
        count_2026 = 0

        for row in rows[1:]:
            try:
                codigo_dane = str(row[0]).strip()
                departamento = str(row[1]).strip()
                municipio = str(row[2]).strip()

                # Insertar municipio
                self.insert_municipio(codigo_dane, departamento, municipio)

                # Bloque 1: ICLD (posiciones 3-10)
                for i, year in enumerate(years_617):
                    valor = self.validate_value('ley_617_icld', 'valor', row[3 + i])
                    self.conn.execute(
                        "INSERT INTO ley_617_icld (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                        (codigo_dane, year, valor)
                    )
                    count_icld += 1

                # Bloque 2: Gastos de Funcionamiento (posiciones 12-19)
                # Posición 11 es separador "CÓDIGO DANE" - se ignora
                for i, year in enumerate(years_617):
                    valor = self.validate_value('ley_617_gastos_funcionamiento', 'valor', row[12 + i])
                    self.conn.execute(
                        "INSERT INTO ley_617_gastos_funcionamiento (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                        (codigo_dane, year, valor)
                    )
                    count_gf += 1

                # Bloque 3: Razón (posiciones 21-28)
                # Posición 20 es separador "CÓDIGO DANE" - se ignora
                for i, year in enumerate(years_617):
                    valor = self.validate_value('ley_617_razon', 'valor', row[21 + i])
                    self.conn.execute(
                        "INSERT INTO ley_617_razon (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                        (codigo_dane, year, valor)
                    )
                    count_razon += 1

                # Bloque 4: Holgura (posiciones 30-37)
                # Posición 29 es separador "CÓDIGO DANE" - se ignora
                for i, year in enumerate(years_617):
                    valor = self.validate_value('ley_617_holgura', 'valor', row[30 + i])
                    self.conn.execute(
                        "INSERT INTO ley_617_holgura (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                        (codigo_dane, year, valor)
                    )
                    count_holgura += 1

                # Bloque 5: Límite de Gasto (posición 38)
                if len(row) > 38:
                    limite_gasto = self.validate_value('ley_617_limite_gasto', 'limite_gasto', row[38])
                    self.conn.execute(
                        "INSERT INTO ley_617_limite_gasto (codigo_dane, limite_gasto) VALUES (?, ?)",
                        (codigo_dane, limite_gasto)
                    )
                    count_limite += 1

                # Bloque 6: Vigencia 2026 (posiciones 40-44)
                # Posición 39 es separador "CÓDIGO DANE" - se ignora
                if len(row) > 44:
                    icld_2026 = self.validate_value('ley_617_vigencia_2026', 'icld', row[40])
                    gf_2026 = self.validate_value('ley_617_vigencia_2026', 'gf', row[41])
                    lg_2026 = self.validate_value('ley_617_vigencia_2026', 'lg', row[42])
                    razon_2026 = self.validate_value('ley_617_vigencia_2026', 'razon', row[43])
                    holgura_2026 = self.validate_value('ley_617_vigencia_2026', 'holgura', row[44])

                    self.conn.execute(
                        """INSERT INTO ley_617_vigencia_2026
                           (codigo_dane, icld, gf, lg, razon, holgura)
                           VALUES (?, ?, ?, ?, ?, ?)""",
                        (codigo_dane, icld_2026, gf_2026, lg_2026, razon_2026, holgura_2026)
                    )
                    count_2026 += 1

            except Exception as e:
                logger.error(f"Error en ef_admin para municipio {codigo_dane}: {e}")

        self.conn.commit()
        logger.info(f"Insertados {count_icld} registros en ley_617_icld")
        logger.info(f"Insertados {count_gf} registros en ley_617_gastos_funcionamiento")
        logger.info(f"Insertados {count_razon} registros en ley_617_razon")
        logger.info(f"Insertados {count_holgura} registros en ley_617_holgura")
        logger.info(f"Insertados {count_limite} registros en ley_617_limite_gasto")
        logger.info(f"Insertados {count_2026} registros en ley_617_vigencia_2026")

    def migrate_indicadores_ley_550(self):
        """Migrar indicadores de Ley 550 (bi-sección)"""
        logger.info("Migrando indicadores Ley 550...")

        data = self.parse_json_file(config.JSON_FILES['indicadores_ley_550'])
        rows = data.get('rows', [])

        if not rows:
            logger.warning("No se encontraron filas en indicadores_ley_550")
            return

        headers = rows[0]

        # Estructura:
        # Bloque 1 (Eficiencia Fiscal): posiciones 3-9 (años 2019-2025)
        # Bloque 2 (Eficiencia Administrativa): posiciones 10-16 (años 2019-2025)

        years_550 = list(range(2019, 2026))  # 2019-2025
        count_fiscal = 0
        count_admin = 0

        for row in rows[1:]:
            try:
                codigo_dane = str(row[0]).strip()
                departamento = str(row[1]).strip()
                municipio = str(row[2]).strip()

                # Insertar municipio
                self.insert_municipio(codigo_dane, departamento, municipio)

                # Bloque 1: Eficiencia Fiscal (posiciones 3-9)
                for i, year in enumerate(years_550):
                    valor = self.validate_value('indicadores_eficiencia_fiscal', 'valor', row[3 + i])
                    self.conn.execute(
                        "INSERT INTO indicadores_eficiencia_fiscal (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                        (codigo_dane, year, valor)
                    )
                    count_fiscal += 1

                # Bloque 2: Eficiencia Administrativa (posiciones 10-16)
                for i, year in enumerate(years_550):
                    if len(row) > 10 + i:
                        valor = self.validate_value('indicadores_eficiencia_administrativa', 'valor', row[10 + i])
                        self.conn.execute(
                            "INSERT INTO indicadores_eficiencia_administrativa (codigo_dane, anio, valor) VALUES (?, ?, ?)",
                            (codigo_dane, year, valor)
                        )
                        count_admin += 1

            except Exception as e:
                logger.error(f"Error en indicadores Ley 550 para municipio {codigo_dane}: {e}")

        self.conn.commit()
        logger.info(f"Insertados {count_fiscal} registros en indicadores_eficiencia_fiscal")
        logger.info(f"Insertados {count_admin} registros en indicadores_eficiencia_administrativa")

    def update_metadata(self):
        """Actualizar tabla de metadatos con información de migración"""
        logger.info("Actualizando metadatos...")

        # Contar municipios
        cursor = self.conn.execute("SELECT COUNT(*) FROM municipios")
        total_municipios = cursor.fetchone()[0]

        # Actualizar metadatos
        self.conn.execute(
            "INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)",
            ('fecha_migracion', datetime.now().isoformat())
        )
        self.conn.execute(
            "INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)",
            ('total_municipios', str(total_municipios))
        )

        self.conn.commit()
        logger.info(f"Metadatos actualizados. Total municipios: {total_municipios}")

    def close(self):
        """Cerrar conexión a base de datos"""
        if self.conn:
            self.conn.close()
            logger.info("Conexión a base de datos cerrada")

    def run(self):
        """Ejecutar migración completa"""
        try:
            logger.info("=" * 80)
            logger.info("INICIANDO MIGRACIÓN DE DATOS JSON A SQLITE")
            logger.info("=" * 80)

            self.connect_db()
            self.create_schema()

            # Migrar datos en orden
            self.migrate_ingresos_tributarios()
            self.migrate_poblacion()
            self.migrate_recursos()
            self.migrate_ef_admin()
            self.migrate_indicadores_ley_550()

            # Actualizar metadatos
            self.update_metadata()

            logger.info("=" * 80)
            logger.info("MIGRACIÓN COMPLETADA EXITOSAMENTE")
            logger.info(f"Base de datos creada en: {config.DB_PATH}")
            logger.info("=" * 80)

        except Exception as e:
            logger.error(f"Error durante la migración: {e}", exc_info=True)
            raise

        finally:
            self.close()


def main():
    """Punto de entrada principal"""
    migrator = DataMigrator()
    migrator.run()


if __name__ == '__main__':
    main()
