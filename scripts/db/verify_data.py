"""
Script de validación post-migración
Verifica la integridad y completitud de los datos migrados a SQLite
"""

import sqlite3
import logging
from typing import List, Tuple
import config

# Configurar logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT
)
logger = logging.getLogger(__name__)


class DataValidator:
    """Clase para validar datos migrados"""

    def __init__(self):
        self.conn: sqlite3.Connection = None
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def connect_db(self):
        """Conectar a la base de datos"""
        logger.info(f"Conectando a base de datos: {config.DB_PATH}")
        self.conn = sqlite3.connect(config.DB_PATH)

    def validate_record_counts(self):
        """Validar conteo de registros en cada tabla"""
        logger.info("Validando conteo de registros...")

        expected_counts = {
            'municipios': (1000, 1200, "Municipios"),
            'ingresos_tributarios': (13000, 14000, "Ingresos tributarios"),
            'poblacion': (14000, 15000, "Población"),
            'recursos_proposito_general': (8500, 9500, "Recursos propósito general"),
            'ley_617_icld': (8500, 9500, "Ley 617 - ICLD"),
            'ley_617_gastos_funcionamiento': (8500, 9500, "Ley 617 - Gastos funcionamiento"),
            'ley_617_razon': (8500, 9500, "Ley 617 - Razón"),
            'ley_617_holgura': (8500, 9500, "Ley 617 - Holgura"),
            'ley_617_limite_gasto': (1000, 1200, "Ley 617 - Límite gasto"),
            'ley_617_vigencia_2026': (1000, 1200, "Ley 617 - Vigencia 2026"),
            'indicadores_eficiencia_fiscal': (7500, 8500, "Indicadores - Eficiencia fiscal"),
            'indicadores_eficiencia_administrativa': (7500, 8500, "Indicadores - Eficiencia administrativa")
        }

        for table, (min_count, max_count, description) in expected_counts.items():
            cursor = self.conn.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]

            if count < min_count or count > max_count:
                self.warnings.append(f"{description}: {count} registros (esperado: {min_count}-{max_count})")
                logger.warning(f"✗ {description}: {count} registros (fuera de rango esperado)")
            else:
                logger.info(f"✓ {description}: {count} registros (OK)")

    def validate_referential_integrity(self):
        """Validar integridad referencial"""
        logger.info("Validando integridad referencial...")

        # Tablas con FK a municipios
        fk_tables = [
            'ingresos_tributarios',
            'poblacion',
            'recursos_proposito_general',
            'ley_617_icld',
            'ley_617_gastos_funcionamiento',
            'ley_617_razon',
            'ley_617_holgura',
            'ley_617_limite_gasto',
            'ley_617_vigencia_2026',
            'indicadores_eficiencia_fiscal',
            'indicadores_eficiencia_administrativa'
        ]

        for table in fk_tables:
            query = f"""
                SELECT COUNT(*) FROM {table} t
                LEFT JOIN municipios m ON t.codigo_dane = m.codigo_dane
                WHERE m.codigo_dane IS NULL
            """
            cursor = self.conn.execute(query)
            orphaned = cursor.fetchone()[0]

            if orphaned > 0:
                self.errors.append(f"{table}: {orphaned} registros sin municipio válido")
                logger.error(f"✗ {table}: {orphaned} registros huérfanos")
            else:
                logger.info(f"✓ {table}: Integridad referencial OK")

    def validate_year_ranges(self):
        """Validar rangos de años válidos"""
        logger.info("Validando rangos de años...")

        year_ranges = {
            'ingresos_tributarios': (2013, 2024),
            'poblacion': (2013, 2025),
            'recursos_proposito_general': (2018, 2025),
            'ley_617_icld': (2016, 2023),
            'ley_617_gastos_funcionamiento': (2016, 2023),
            'ley_617_razon': (2016, 2023),
            'ley_617_holgura': (2016, 2023),
            'indicadores_eficiencia_fiscal': (2019, 2025),
            'indicadores_eficiencia_administrativa': (2019, 2025)
        }

        for table, (min_year, max_year) in year_ranges.items():
            cursor = self.conn.execute(f"SELECT MIN(anio), MAX(anio) FROM {table}")
            result = cursor.fetchone()

            if result[0] is None or result[1] is None:
                self.warnings.append(f"{table}: No tiene datos de años")
                logger.warning(f"✗ {table}: Sin datos de años")
                continue

            actual_min, actual_max = result

            if actual_min != min_year or actual_max != max_year:
                self.warnings.append(
                    f"{table}: Rango de años {actual_min}-{actual_max} (esperado: {min_year}-{max_year})"
                )
                logger.warning(f"✗ {table}: Rango {actual_min}-{actual_max} (esperado: {min_year}-{max_year})")
            else:
                logger.info(f"✓ {table}: Rango de años {actual_min}-{actual_max} (OK)")

    def validate_uniqueness_constraints(self):
        """Validar constraints UNIQUE"""
        logger.info("Validando constraints de unicidad...")

        # Tablas con UNIQUE(codigo_dane, anio)
        unique_tables = [
            'ingresos_tributarios',
            'poblacion',
            'recursos_proposito_general',
            'ley_617_icld',
            'ley_617_gastos_funcionamiento',
            'ley_617_razon',
            'ley_617_holgura',
            'indicadores_eficiencia_fiscal',
            'indicadores_eficiencia_administrativa'
        ]

        for table in unique_tables:
            query = f"""
                SELECT codigo_dane, anio, COUNT(*) as duplicados
                FROM {table}
                GROUP BY codigo_dane, anio
                HAVING duplicados > 1
            """
            cursor = self.conn.execute(query)
            duplicates = cursor.fetchall()

            if duplicates:
                self.errors.append(f"{table}: {len(duplicates)} duplicados encontrados")
                logger.error(f"✗ {table}: {len(duplicates)} duplicados encontrados")
            else:
                logger.info(f"✓ {table}: Sin duplicados (OK)")

    def validate_null_patterns(self):
        """Validar patrones de valores NULL"""
        logger.info("Validando patrones de NULL...")

        # Verificar que municipios no tengan campos NULL
        cursor = self.conn.execute("""
            SELECT COUNT(*) FROM municipios
            WHERE codigo_dane IS NULL OR departamento IS NULL OR municipio IS NULL
        """
        )
        null_municipios = cursor.fetchone()[0]

        if null_municipios > 0:
            self.errors.append(f"municipios: {null_municipios} registros con campos NULL")
            logger.error(f"✗ municipios: {null_municipios} registros con campos NULL")
        else:
            logger.info("✓ municipios: Sin campos NULL (OK)")

        # Verificar porcentaje de NULL en tablas de datos
        data_tables = [
            ('ingresos_tributarios', 'valor'),
            ('poblacion', 'poblacion'),
            ('ley_617_icld', 'valor'),
            ('indicadores_eficiencia_fiscal', 'valor')
        ]

        for table, column in data_tables:
            cursor = self.conn.execute(f"SELECT COUNT(*) FROM {table}")
            total = cursor.fetchone()[0]

            cursor = self.conn.execute(f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL")
            null_count = cursor.fetchone()[0]

            if total > 0:
                null_percentage = (null_count / total) * 100
                if null_percentage > 50:
                    self.warnings.append(f"{table}.{column}: {null_percentage:.1f}% NULL")
                    logger.warning(f"✗ {table}.{column}: {null_percentage:.1f}% NULL (alto)")
                else:
                    logger.info(f"✓ {table}.{column}: {null_percentage:.1f}% NULL")

    def validate_missing_municipalities(self):
        """Detectar municipios sin datos en alguna tabla"""
        logger.info("Validando completitud de datos por municipio...")

        tables_to_check = [
            'ingresos_tributarios',
            'poblacion',
            'recursos_proposito_general'
        ]

        for table in tables_to_check:
            query = f"""
                SELECT m.codigo_dane, m.municipio, COUNT(t.id) as count
                FROM municipios m
                LEFT JOIN {table} t ON m.codigo_dane = t.codigo_dane
                GROUP BY m.codigo_dane, m.municipio
                HAVING count = 0
            """
            cursor = self.conn.execute(query)
            missing = cursor.fetchall()

            if missing:
                self.warnings.append(f"{table}: {len(missing)} municipios sin datos")
                logger.warning(f"✗ {table}: {len(missing)} municipios sin datos")
            else:
                logger.info(f"✓ {table}: Todos los municipios tienen datos")

    def validate_indexes(self):
        """Verificar que los índices existan"""
        logger.info("Validando índices...")

        cursor = self.conn.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
        indexes = [row[0] for row in cursor.fetchall()]

        expected_indexes = [
            'idx_ingresos_anio',
            'idx_poblacion_anio',
            'idx_recursos_anio',
            'idx_ley617_icld_anio',
            'idx_ingresos_dane_anio',
            'idx_poblacion_dane_anio'
        ]

        missing_indexes = [idx for idx in expected_indexes if idx not in indexes]

        if missing_indexes:
            self.warnings.append(f"Índices faltantes: {', '.join(missing_indexes)}")
            logger.warning(f"✗ Índices faltantes: {missing_indexes}")
        else:
            logger.info(f"✓ Todos los índices esperados existen ({len(indexes)} índices)")

    def generate_report(self):
        """Generar reporte de validación"""
        logger.info("Generando reporte de validación...")

        report_path = config.DB_PATH.replace('.db', '_validation_report.txt')

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("REPORTE DE VALIDACIÓN DE DATOS MIGRADOS\n")
            f.write("=" * 80 + "\n\n")

            f.write(f"Base de datos: {config.DB_PATH}\n\n")

            # Metadatos
            cursor = self.conn.execute("SELECT key, value FROM _metadata")
            f.write("METADATOS:\n")
            for key, value in cursor.fetchall():
                f.write(f"  {key}: {value}\n")
            f.write("\n")

            # Errores
            if self.errors:
                f.write(f"ERRORES ({len(self.errors)}):\n")
                for error in self.errors:
                    f.write(f"  ✗ {error}\n")
                f.write("\n")
            else:
                f.write("ERRORES: Ninguno ✓\n\n")

            # Advertencias
            if self.warnings:
                f.write(f"ADVERTENCIAS ({len(self.warnings)}):\n")
                for warning in self.warnings:
                    f.write(f"  ⚠ {warning}\n")
                f.write("\n")
            else:
                f.write("ADVERTENCIAS: Ninguna ✓\n\n")

            # Resumen
            f.write("RESUMEN:\n")
            cursor = self.conn.execute("SELECT COUNT(*) FROM municipios")
            f.write(f"  Total municipios: {cursor.fetchone()[0]}\n")

            cursor = self.conn.execute("""
                SELECT
                    (SELECT COUNT(*) FROM ingresos_tributarios) +
                    (SELECT COUNT(*) FROM poblacion) +
                    (SELECT COUNT(*) FROM recursos_proposito_general) +
                    (SELECT COUNT(*) FROM ley_617_icld) +
                    (SELECT COUNT(*) FROM ley_617_gastos_funcionamiento) +
                    (SELECT COUNT(*) FROM ley_617_razon) +
                    (SELECT COUNT(*) FROM ley_617_holgura) +
                    (SELECT COUNT(*) FROM ley_617_limite_gasto) +
                    (SELECT COUNT(*) FROM ley_617_vigencia_2026) +
                    (SELECT COUNT(*) FROM indicadores_eficiencia_fiscal) +
                    (SELECT COUNT(*) FROM indicadores_eficiencia_administrativa)
                AS total
            """)
            f.write(f"  Total registros de datos: {cursor.fetchone()[0]:,}\n")

            f.write("\n" + "=" * 80 + "\n")

            if not self.errors:
                f.write("VALIDACIÓN COMPLETADA EXITOSAMENTE ✓\n")
            else:
                f.write(f"VALIDACIÓN COMPLETADA CON {len(self.errors)} ERRORES ✗\n")

            f.write("=" * 80 + "\n")

        logger.info(f"Reporte generado en: {report_path}")

    def close(self):
        """Cerrar conexión"""
        if self.conn:
            self.conn.close()

    def run(self):
        """Ejecutar validación completa"""
        try:
            logger.info("=" * 80)
            logger.info("INICIANDO VALIDACIÓN DE DATOS MIGRADOS")
            logger.info("=" * 80)

            self.connect_db()

            # Ejecutar todas las validaciones
            self.validate_record_counts()
            self.validate_referential_integrity()
            self.validate_year_ranges()
            self.validate_uniqueness_constraints()
            self.validate_null_patterns()
            self.validate_missing_municipalities()
            self.validate_indexes()

            # Generar reporte
            self.generate_report()

            logger.info("=" * 80)
            if not self.errors:
                logger.info("VALIDACIÓN COMPLETADA EXITOSAMENTE ✓")
            else:
                logger.error(f"VALIDACIÓN COMPLETADA CON {len(self.errors)} ERRORES ✗")
            logger.info("=" * 80)

        except Exception as e:
            logger.error(f"Error durante la validación: {e}", exc_info=True)
            raise

        finally:
            self.close()


def main():
    """Punto de entrada principal"""
    validator = DataValidator()
    validator.run()


if __name__ == '__main__':
    main()
