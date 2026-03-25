#!/usr/bin/env python3
"""
Script para exportar todos los municipios desde SQLite a JSON para datos mock

Este script lee todos los municipios de eficiencias.db y genera un archivo JSON
con la estructura completa para ser usado por EficienciasMockService.

Uso:
    python export_all_municipios.py
"""

import sqlite3
import json
import sys
from pathlib import Path

# Rutas absolutas
SCRIPT_DIR = Path(__file__).parent
DB_PATH = SCRIPT_DIR / "../../src/assets/db/eficiencias.db"
OUTPUT_PATH = SCRIPT_DIR / "../../src/assets/data/eficiencias/resumen-municipios.json"

def get_municipio_resumen(conn, codigo_dane):
    """
    Obtener resumen completo de un municipio

    Args:
        conn: Conexión SQLite
        codigo_dane: Código DANE del municipio

    Returns:
        dict: Resumen completo del municipio
    """
    cur = conn.cursor()

    # Municipio
    cur.execute('SELECT * FROM municipios WHERE codigo_dane = ?', (codigo_dane,))
    municipio = cur.fetchone()

    if not municipio:
        return None

    municipio_dict = {
        'codigo_dane': municipio[0],
        'departamento': municipio[1],
        'municipio': municipio[2]
    }

    # Ingresos tributarios (últimos 10 años para cubrir todas las vigencias)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor, observacion
        FROM ingresos_tributarios
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    ingresos = []
    for row in cur.fetchall():
        ingresos.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3],
            'observacion': row[4]
        })

    # Población (últimos 10 años para cubrir todas las vigencias)
    cur.execute('''
        SELECT id, codigo_dane, anio, poblacion, fuente_censo
        FROM poblacion
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    poblacion = []
    for row in cur.fetchall():
        poblacion.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'poblacion': row[3],
            'fuente_censo': row[4]
        })

    # Recursos propósito general (últimos 10 años para cubrir todas las vigencias)
    cur.execute('''
        SELECT id, codigo_dane, anio, poblacion_m, pobreza_m, poblacion,
               pobreza, eficiencia_fiscal, eficiencia_administrativa, sisben
        FROM recursos_proposito_general
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    recursos = []
    for row in cur.fetchall():
        recursos.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'poblacion_m': row[3],
            'pobreza_m': row[4],
            'poblacion': row[5],
            'pobreza': row[6],
            'eficiencia_fiscal': row[7],
            'eficiencia_administrativa': row[8],
            'sisben': row[9]
        })

    # Eficiencia fiscal (todos los años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM indicadores_eficiencia_fiscal
        WHERE codigo_dane = ?
        ORDER BY anio DESC
    ''', (codigo_dane,))

    eficiencia_fiscal = []
    for row in cur.fetchall():
        eficiencia_fiscal.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # Eficiencia administrativa (todos los años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM indicadores_eficiencia_administrativa
        WHERE codigo_dane = ?
        ORDER BY anio DESC
    ''', (codigo_dane,))

    eficiencia_administrativa = []
    for row in cur.fetchall():
        eficiencia_administrativa.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # Vigencia 2026
    cur.execute('''
        SELECT codigo_dane, icld, gf, lg, razon, holgura
        FROM ley_617_vigencia_2026
        WHERE codigo_dane = ?
    ''', (codigo_dane,))

    vigencia_2026_row = cur.fetchone()
    vigencia_2026 = None

    if vigencia_2026_row:
        vigencia_2026 = {
            'codigo_dane': vigencia_2026_row[0],
            'icld': vigencia_2026_row[1],
            'gf': vigencia_2026_row[2],
            'lg': vigencia_2026_row[3],
            'razon': vigencia_2026_row[4],
            'holgura': vigencia_2026_row[5]
        }

    # Ley 617 - ICLD (últimos 10 años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM ley_617_icld
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    ley_617_icld = []
    for row in cur.fetchall():
        ley_617_icld.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # Ley 617 - Gastos de Funcionamiento (últimos 10 años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM ley_617_gastos_funcionamiento
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    ley_617_gastos_funcionamiento = []
    for row in cur.fetchall():
        ley_617_gastos_funcionamiento.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # Ley 617 - Razón (últimos 10 años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM ley_617_razon
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    ley_617_razon = []
    for row in cur.fetchall():
        ley_617_razon.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # Ley 617 - Holgura (últimos 10 años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM ley_617_holgura
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    ley_617_holgura = []
    for row in cur.fetchall():
        ley_617_holgura.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    # NBI - Necesidades Básicas Insatisfechas (últimos 10 años)
    cur.execute('''
        SELECT id, codigo_dane, anio, valor
        FROM nbi
        WHERE codigo_dane = ?
        ORDER BY anio DESC
        LIMIT 10
    ''', (codigo_dane,))

    nbi = []
    for row in cur.fetchall():
        nbi.append({
            'id': row[0],
            'codigo_dane': row[1],
            'anio': row[2],
            'valor': row[3]
        })

    return {
        'municipio': municipio_dict,
        'ingresos_tributarios': ingresos,
        'poblacion': poblacion,
        'recursos_proposito_general': recursos,
        'eficiencia_fiscal': eficiencia_fiscal,
        'eficiencia_administrativa': eficiencia_administrativa,
        'vigencia_2026': vigencia_2026,
        'ley_617_icld': ley_617_icld,
        'ley_617_gastos_funcionamiento': ley_617_gastos_funcionamiento,
        'ley_617_razon': ley_617_razon,
        'ley_617_holgura': ley_617_holgura,
        'nbi': nbi
    }

def export_all_municipios():
    """
    Exportar todos los municipios a JSON
    """
    print("=" * 80)
    print("EXPORTACIÓN DE TODOS LOS MUNICIPIOS A JSON")
    print("=" * 80)

    # Verificar que existe la base de datos
    if not DB_PATH.exists():
        print(f"\n[ERROR] ERROR: Base de datos no encontrada en: {DB_PATH}")
        print("\nEjecuta primero el script de migración:")
        print("  cd scripts/db")
        print("  python migrate_data.py")
        return 1

    print(f"\n[DB] Base de datos: {DB_PATH}")
    print(f"[OUTPUT] Archivo de salida: {OUTPUT_PATH}")

    # Conectar a la base de datos
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()

    # Obtener todos los códigos DANE
    cur.execute('SELECT codigo_dane FROM municipios ORDER BY codigo_dane')
    codigos_dane = [row[0] for row in cur.fetchall()]

    total_municipios = len(codigos_dane)
    print(f"\n[INFO] Total de municipios a exportar: {total_municipios}")

    # Exportar cada municipio
    resultado = {}
    exportados = 0
    sin_datos = 0

    print("\n[EXPORT] Exportando municipios...")

    for i, codigo_dane in enumerate(codigos_dane, 1):
        resumen = get_municipio_resumen(conn, codigo_dane)

        if resumen:
            resultado[codigo_dane] = resumen
            exportados += 1

            # Mostrar progreso cada 100 municipios
            if i % 100 == 0:
                print(f"  Progreso: {i}/{total_municipios} ({(i/total_municipios)*100:.1f}%)")
        else:
            sin_datos += 1
            print(f"  [WARN] Municipio {codigo_dane} sin datos")

    conn.close()

    # Guardar JSON
    print(f"\n[SAVE] Guardando JSON...")

    # Asegurar que el directorio existe
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)

    # Estadísticas
    file_size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)

    print("\n" + "=" * 80)
    print("[SUCCESS] EXPORTACION COMPLETADA")
    print("=" * 80)
    print(f"\n[STATS] Estadisticas:")
    print(f"  - Municipios exportados: {exportados}")
    print(f"  - Municipios sin datos:  {sin_datos}")
    print(f"  - Tamanio del archivo:   {file_size_mb:.2f} MB")
    print(f"\n[FILE] Archivo generado:")
    print(f"  {OUTPUT_PATH}")
    print("\n[INFO] Para usar en la aplicacion:")
    print(f"  1. Verificar que USE_MOCK_EFICIENCIAS = true en sicodis-api.service.ts")
    print(f"  2. El archivo ya esta en la ubicacion correcta")
    print(f"  3. Reiniciar Angular si es necesario")
    print()

    return 0

if __name__ == '__main__':
    sys.exit(export_all_municipios())
