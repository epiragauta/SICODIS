# Destinación Étnica - Guía de Uso

## 📊 Resumen de Datos

### Estadísticas Generales (Bienio 2025-2026)

- **Total de registros**: 6,963
- **Registros con destinación étnica**: 686 (9.85%)
- **Registros sin destinación étnica**: 6,277 (90.15%)

### Distribución por Tipo de Entidad

| Tipo de Entidad | Registros con Destinación Étnica |
|-----------------|----------------------------------|
| **Municipio** | 658 registros |
| **Gobernación** | 28 registros |

---

## 🔍 ¿Qué es Destinación Étnica?

La **destinación étnica** es un atributo de los registros de presupuesto que indica si un proyecto o asignación está dirigido específicamente a comunidades étnicas (indígenas, afrocolombianas, raizales, palenqueras, NARP, Rrom, etc.).

**Importante**: No confundir con:
- **Entidades de tipo "Étnicos"**: Son entidades territoriales o administrativas de comunidades étnicas (3 entidades)
- **Destinación étnica**: Es una característica de los proyectos/asignaciones (686 registros)

---

## 💻 Uso en el Código

### 1. Filtrar por Destinación Étnica

```typescript
import { SgrPresupuestoService } from '../../services/sgr-presupuesto.service';
import { FiltrosSGR } from '../../models/sgr-presupuesto.models';

constructor(private sgrService: SgrPresupuestoService) {}

// Filtrar solo registros CON destinación étnica
const filtros: FiltrosSGR = {
  destinacionEtnica: true
};

this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
  console.log('Registros con destinación étnica:', datos.registrosDestinacionEtnica);
  console.log('Presupuesto destinado:', datos.presupuestoTotal);
  console.log('Recaudo:', datos.recaudoTotal);
});

// Filtrar solo registros SIN destinación étnica
const filtrosSin: FiltrosSGR = {
  destinacionEtnica: false
};

// Filtrar municipios PDET con destinación étnica
const filtrosCombinados: FiltrosSGR = {
  tipoEntidad: 'Municipio',
  pdet: true,
  destinacionEtnica: true
};
```

### 2. Obtener Conteo de Destinación Étnica

```typescript
this.sgrService.getDatosAgregados().subscribe(datos => {
  // Conteo total de registros con destinación étnica
  const total = datos.registrosDestinacionEtnica;
  console.log(`Total registros con destinación étnica: ${total}`);
});
```

### 3. Ejemplo en Componente

```typescript
import { Component, OnInit } from '@angular/core';
import { SgrPresupuestoService } from '../../services/sgr-presupuesto.service';

@Component({
  selector: 'app-destinacion-etnica',
  template: `
    <div class="destinacion-etnica-stats">
      <h3>Destinación Étnica</h3>
      <p>Registros: {{ registrosDestinacionEtnica }}</p>
      <p>Presupuesto: {{ presupuestoDestinacionEtnica | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
      <p>Avance: {{ avanceDestinacionEtnica | percent:'1.2-2' }}</p>
    </div>
  `
})
export class DestinacionEtnicaComponent implements OnInit {
  registrosDestinacionEtnica = 0;
  presupuestoDestinacionEtnica = 0;
  avanceDestinacionEtnica = 0;

  constructor(private sgrService: SgrPresupuestoService) {}

  ngOnInit() {
    // Obtener datos solo de destinación étnica
    const filtros = { destinacionEtnica: true };

    this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
      this.registrosDestinacionEtnica = datos.registrosDestinacionEtnica;
      this.presupuestoDestinacionEtnica = datos.presupuestoTotal;
      this.avanceDestinacionEtnica = datos.avancePromedio;
    });
  }
}
```

---

## 🎨 Agregar al Componente de Información General

### Opción 1: Agregar como tarjeta de conteo

En `sgr-informacion-general.component.html`:

```html
<!-- Agregar después de las otras tarjetas de entidades -->
<div class="entidad-card destinacion-etnica">
  <div class="entidad-icon">
    <i class="pi pi-heart"></i>
  </div>
  <div class="entidad-info">
    <h4>Destinación Étnica</h4>
    <p class="entidad-count">{{ registrosDestinacionEtnica }}</p>
    <span class="entidad-label">Registros</span>
  </div>
</div>
```

En `sgr-informacion-general.component.ts`:

```typescript
// Agregar variable
registrosDestinacionEtnica = 0;

// Actualizar en loadData()
private actualizarDatosComponente(datos: DatosAgregados): void {
  // ... código existente ...

  // Agregar conteo de destinación étnica
  this.registrosDestinacionEtnica = datos.registrosDestinacionEtnica;
}
```

### Opción 2: Agregar como filtro en la UI

En el HTML, agregar checkbox para filtrar:

```html
<div class="filtro-group">
  <label>
    <input
      type="checkbox"
      [(ngModel)]="filtroDestinacionEtnica"
      (change)="aplicarFiltros()"
    />
    Solo destinación étnica
  </label>
</div>
```

En el componente:

```typescript
filtroDestinacionEtnica: boolean | null = null;

loadData(): void {
  const filtros: FiltrosSGR = {
    // ... filtros existentes ...
  };

  // Agregar filtro de destinación étnica si está activo
  if (this.filtroDestinacionEtnica !== null) {
    filtros.destinacionEtnica = this.filtroDestinacionEtnica;
  }

  this.sgrPresupuestoService.getDatosAgregados(filtros)
    .subscribe(datos => {
      this.actualizarDatosComponente(datos);
    });
}
```

---

## 📈 Casos de Uso

### Caso 1: Presupuesto destinado a comunidades étnicas
```typescript
const filtros = { destinacionEtnica: true };

this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
  console.log('Presupuesto para comunidades étnicas:', datos.presupuestoTotal);
  console.log('Número de proyectos:', datos.registrosDestinacionEtnica);
});
```

### Caso 2: Municipios PDET con destinación étnica
```typescript
const filtros = {
  tipoEntidad: 'Municipio',
  pdet: true,
  destinacionEtnica: true
};

this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
  console.log('Municipios PDET con destinación étnica:', datos.entidadesCount.beneficiarias);
  console.log('Proyectos con destinación étnica:', datos.registrosDestinacionEtnica);
});
```

### Caso 3: Comparar destinación étnica vs no étnica
```typescript
// Con destinación étnica
this.sgrService.getDatosAgregados({ destinacionEtnica: true })
  .subscribe(datosConEtnica => {
    console.log('Presupuesto étnico:', datosConEtnica.presupuestoTotal);
  });

// Sin destinación étnica
this.sgrService.getDatosAgregados({ destinacionEtnica: false })
  .subscribe(datosSinEtnica => {
    console.log('Presupuesto no étnico:', datosSinEtnica.presupuestoTotal);
  });
```

### Caso 4: Análisis por región con destinación étnica
```typescript
const regiones = [
  'Región Caribe',
  'Región Pacífico',
  'Región Centro - Sur - Amazonía'
];

regiones.forEach(region => {
  const filtros = {
    region,
    destinacionEtnica: true
  };

  this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
    console.log(`${region}: ${datos.presupuestoTotal} (${datos.registrosDestinacionEtnica} proyectos)`);
  });
});
```

---

## 🔢 Estadísticas Detalladas

### Por Concepto de Gasto
```typescript
const conceptos = ['Inversión', 'Ahorro', 'Administración'];

conceptos.forEach(concepto => {
  const filtros = {
    conceptoGasto: concepto,
    destinacionEtnica: true
  };

  this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
    console.log(`${concepto}: ${datos.registrosDestinacionEtnica} registros`);
  });
});
```

### Por Tipo de Entidad
```typescript
// Municipios con destinación étnica
this.sgrService.getDatosAgregados({
  tipoEntidad: 'Municipio',
  destinacionEtnica: true
}).subscribe(datos => {
  console.log('Municipios:', datos.entidadesCount.beneficiarias);
  console.log('Registros:', datos.registrosDestinacionEtnica);
});

// Gobernaciones con destinación étnica
this.sgrService.getDatosAgregados({
  tipoEntidad: 'Gobernación',
  destinacionEtnica: true
}).subscribe(datos => {
  console.log('Gobernaciones:', datos.entidadesCount.beneficiarias);
  console.log('Registros:', datos.registrosDestinacionEtnica);
});
```

---

## 🎯 Métricas Disponibles

Cuando filtras por `destinacionEtnica: true`, obtienes:

```typescript
interface DatosAgregados {
  entidadesCount: {
    beneficiarias: number;    // Entidades que reciben fondos con destinación étnica
    productoras: number;       // De esas, cuántas son productoras
    zomac: number;            // De esas, cuántas son ZOMAC
    pdet: number;             // De esas, cuántas son PDET
    etnicas: number;          // Entidades de TIPO "Étnicos"
  };
  presupuestoTotal: number;             // Presupuesto total destinado
  recaudoTotal: number;                 // Recaudo total
  avancePromedio: number;               // Avance promedio de ejecución
  presupuestoCorriente: number;         // Presupuesto corriente
  presupuestoOtros: number;            // Otros componentes
  recaudoCorriente: number;            // Recaudo corriente
  recaudoOtros: number;                // Recaudo otros
  registrosDestinacionEtnica: number;  // Conteo de registros filtrados
}
```

---

## ✅ Verificación

Para verificar que el filtro funciona correctamente:

```typescript
// Sin filtro
this.sgrService.getDatosAgregados().subscribe(todos => {
  console.log('Total registros:', 6963);

  // Con filtro true
  this.sgrService.getDatosAgregados({ destinacionEtnica: true })
    .subscribe(conDestinacion => {
      console.log('Con destinación étnica:', conDestinacion.registrosDestinacionEtnica);
      // Debe ser 686

      // Con filtro false
      this.sgrService.getDatosAgregados({ destinacionEtnica: false })
        .subscribe(sinDestinacion => {
          console.log('Sin destinación étnica:', sinDestinacion.registrosDestinacionEtnica);
          // Debe ser 6277

          // Verificar que suma 6963
          const suma = conDestinacion.registrosDestinacionEtnica + sinDestinacion.registrosDestinacionEtnica;
          console.log('Suma:', suma); // Debe ser 6963
        });
    });
});
```

---

## 📝 Notas Importantes

1. **Diferencia entre entidades étnicas y destinación étnica**:
   - Entidades de tipo "Étnicos": 3 entidades administrativas
   - Registros con destinación étnica: 686 proyectos/asignaciones dirigidos a comunidades

2. **Múltiples filtros**: Puedes combinar destinación étnica con otros filtros (tipo, región, PDET, etc.)

3. **Conteo**: `registrosDestinacionEtnica` cuenta el número de registros, no de entidades únicas

4. **Presupuesto**: Al filtrar por destinación étnica, `presupuestoTotal` muestra solo el presupuesto de esos registros

---

**Actualizado**: 2026-06-02
**Versión de datos**: Bienio 2025-2026
