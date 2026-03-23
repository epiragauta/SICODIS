-- ==============================================================================
-- SICODIS Database Schema - Eficiencias Fiscales y Administrativas
-- ==============================================================================
-- Migración de datos desde archivos JSON en src/assets/data/Eficiencias_hojas/
-- Modelo normalizado en 3NF con 12 tablas principales
-- ==============================================================================

-- ==============================================================================
-- TABLA MAESTRA: Catálogo de Municipios
-- ==============================================================================

CREATE TABLE IF NOT EXISTS municipios (
  codigo_dane TEXT PRIMARY KEY,
  departamento TEXT NOT NULL,
  municipio TEXT NOT NULL
);

-- ==============================================================================
-- SERIES TEMPORALES: Ingresos y Población
-- ==============================================================================

CREATE TABLE IF NOT EXISTS ingresos_tributarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  observacion TEXT,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

CREATE TABLE IF NOT EXISTS poblacion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  poblacion INTEGER,
  fuente_censo TEXT CHECK(fuente_censo IN ('2005', '2018')),
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

-- ==============================================================================
-- RECURSOS PROPÓSITO GENERAL: Once Doceavas
-- ==============================================================================

CREATE TABLE IF NOT EXISTS recursos_proposito_general (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  poblacion_m REAL,
  pobreza_m REAL,
  poblacion REAL,
  pobreza REAL,
  eficiencia_fiscal REAL,
  eficiencia_administrativa REAL,
  sisben REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

-- ==============================================================================
-- LEY 617 DE 2000: Series Temporales
-- ==============================================================================

CREATE TABLE IF NOT EXISTS ley_617_icld (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

CREATE TABLE IF NOT EXISTS ley_617_gastos_funcionamiento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

CREATE TABLE IF NOT EXISTS ley_617_razon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

CREATE TABLE IF NOT EXISTS ley_617_holgura (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

-- ==============================================================================
-- LEY 617 DE 2000: Datos Puntuales (Vigencias Específicas)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS ley_617_limite_gasto (
  codigo_dane TEXT PRIMARY KEY,
  limite_gasto REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane)
);

CREATE TABLE IF NOT EXISTS ley_617_vigencia_2026 (
  codigo_dane TEXT PRIMARY KEY,
  icld REAL,
  gf REAL,
  lg REAL,
  razon REAL,
  holgura REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane)
);

-- ==============================================================================
-- INDICADORES LEY 550: Eficiencia Fiscal y Administrativa
-- ==============================================================================

CREATE TABLE IF NOT EXISTS indicadores_eficiencia_fiscal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

CREATE TABLE IF NOT EXISTS indicadores_eficiencia_administrativa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);

-- ==============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- ==============================================================================

-- Índices por año (para consultas agregadas por período)
CREATE INDEX IF NOT EXISTS idx_ingresos_anio ON ingresos_tributarios(anio);
CREATE INDEX IF NOT EXISTS idx_poblacion_anio ON poblacion(anio);
CREATE INDEX IF NOT EXISTS idx_recursos_anio ON recursos_proposito_general(anio);
CREATE INDEX IF NOT EXISTS idx_ley617_icld_anio ON ley_617_icld(anio);
CREATE INDEX IF NOT EXISTS idx_ley617_gf_anio ON ley_617_gastos_funcionamiento(anio);
CREATE INDEX IF NOT EXISTS idx_ley617_razon_anio ON ley_617_razon(anio);
CREATE INDEX IF NOT EXISTS idx_ley617_holgura_anio ON ley_617_holgura(anio);
CREATE INDEX IF NOT EXISTS idx_eficiencia_fiscal_anio ON indicadores_eficiencia_fiscal(anio);
CREATE INDEX IF NOT EXISTS idx_eficiencia_admin_anio ON indicadores_eficiencia_administrativa(anio);

-- Índices compuestos (para consultas por municipio y año)
CREATE INDEX IF NOT EXISTS idx_ingresos_dane_anio ON ingresos_tributarios(codigo_dane, anio);
CREATE INDEX IF NOT EXISTS idx_poblacion_dane_anio ON poblacion(codigo_dane, anio);
CREATE INDEX IF NOT EXISTS idx_recursos_dane_anio ON recursos_proposito_general(codigo_dane, anio);

-- ==============================================================================
-- TABLA DE METADATOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS _metadata (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Insertar metadatos iniciales
INSERT OR REPLACE INTO _metadata (key, value) VALUES ('version', '1.0');
INSERT OR REPLACE INTO _metadata (key, value) VALUES ('origen', 'Eficiencias_hojas/*.json');
INSERT OR REPLACE INTO _metadata (key, value) VALUES ('descripcion', 'Datos fiscales y administrativos de municipios colombianos');
