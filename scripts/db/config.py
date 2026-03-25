"""
Configuración de rutas para migración de datos JSON a SQLite
"""

import os

# Directorio raíz del proyecto
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# Directorio de archivos JSON fuente
JSON_DIR = os.path.join(PROJECT_ROOT, 'src', 'assets', 'data', 'Eficiencias_hojas')

# Rutas a archivos JSON específicos
JSON_FILES = {
    'ingresos_tributarios': os.path.join(JSON_DIR, 'Datos_Ingresos_Tributarios.json'),
    'poblacion': os.path.join(JSON_DIR, 'Datos_Poblacion.json'),
    'recursos': os.path.join(JSON_DIR, 'Recursos.json'),
    'ef_admin': os.path.join(JSON_DIR, 'Ef_Admin.json'),
    'indicadores_ley_550': os.path.join(JSON_DIR, 'Indicadores_Ley_550.json'),
    'nbi': os.path.join(JSON_DIR, 'NBI.json')
}

# Ruta a la base de datos SQLite
DB_PATH = os.path.join(PROJECT_ROOT, 'src', 'assets', 'db', 'eficiencias.db')

# Ruta al archivo SQL de esquema
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'create_schema.sql')

# Configuración de logging
LOG_LEVEL = 'INFO'
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
