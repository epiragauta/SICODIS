import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectChangeEvent } from 'primeng/select';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-sgp-detalle-presupuestal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    FloatLabel,
    TreeTableModule
  ],
  templateUrl: './sgp-detalle-presupuestal.component.html',
  styleUrl: './sgp-detalle-presupuestal.component.scss'
})
export class SgpDetallePresupuestalComponent implements OnInit {

  // Filtros
  selectedVigencia: any = null;
  selectedDepartamento: any = null;
  selectedMunicipio: any = null;

  // Opciones para los filtros
  vigencias: any[] = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2018', value: '2018' },
    { label: '2017', value: '2017' },
    { label: '2016', value: '2016' },
    { label: '2015', value: '2015' },
    { label: '2014', value: '2014' },
    { label: '2013', value: '2013' },
    { label: '2012', value: '2012' },
    { label: '2011', value: '2011' },
    { label: '2010', value: '2010' },
    { label: '2009', value: '2009' },
    { label: '2008', value: '2008' },
    { label: '2007', value: '2007' },
    { label: '2006', value: '2006' },
    { label: '2005', value: '2005' },
    { label: '2004', value: '2004' },
    { label: '2003', value: '2003' },
    { label: '2002', value: '2002' }
  ];

  departamentos: any[] = [
    { label: 'Antioquia', value: '05' },
    { label: 'Atlántico', value: '08' },
    { label: 'Bogotá D.C.', value: '11' },
    { label: 'Bolívar', value: '13' },
    { label: 'Boyacá', value: '15' },
    { label: 'Caldas', value: '17' },
    { label: 'Caquetá', value: '18' },
    { label: 'Cauca', value: '19' },
    { label: 'Cesar', value: '20' },
    { label: 'Córdoba', value: '23' },
    { label: 'Cundinamarca', value: '25' },
    { label: 'Chocó', value: '27' },
    { label: 'Huila', value: '41' },
    { label: 'La Guajira', value: '44' },
    { label: 'Magdalena', value: '47' },
    { label: 'Meta', value: '50' },
    { label: 'Nariño', value: '52' },
    { label: 'Norte de Santander', value: '54' },
    { label: 'Quindío', value: '63' },
    { label: 'Risaralda', value: '66' },
    { label: 'Santander', value: '68' },
    { label: 'Sucre', value: '70' },
    { label: 'Tolima', value: '73' },
    { label: 'Valle del Cauca', value: '76' },
    { label: 'Arauca', value: '81' },
    { label: 'Casanare', value: '85' },
    { label: 'Putumayo', value: '86' },
    { label: 'San Andrés y Providencia', value: '88' },
    { label: 'Amazonas', value: '91' },
    { label: 'Guainía', value: '94' },
    { label: 'Guaviare', value: '95' },
    { label: 'Vaupés', value: '97' },
    { label: 'Vichada', value: '99' }
  ];

  municipios: any[] = [];

  // Datos de la tarjeta
  totalAsignado: number = 5687181948;
  ultimaDoceava: number = 473931829;
  onceDoceava: number = 521325011;

  // Datos de la tabla
  treeTableData: TreeNode[] = [];
  isLoadingTable: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Inicializar con valores por defecto
    this.selectedVigencia = this.vigencias[1]; // 2025
    this.loadTableData();
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.loadTableData();
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedMunicipio = null;
    
    // Simular carga de municipios según el departamento seleccionado
    if (event.value) {
      this.municipios = [
        { label: 'Municipio 1', value: '001' },
        { label: 'Municipio 2', value: '002' },
        { label: 'Municipio 3', value: '003' }
      ];
    } else {
      this.municipios = [];
    }
  }

  onMunicipioChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    // Aquí se puede agregar lógica para cargar datos específicos del municipio
  }

  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Municipio:', this.selectedMunicipio);
    
    // Aquí se puede agregar lógica para aplicar los filtros y cargar datos
  }

  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.selectedVigencia = this.vigencias[1]; // Mantener 2025 como default
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipios = [];
    
    // Aquí se puede agregar lógica para limpiar datos y cargar valores por defecto
  }

  // Función para formatear números con separadores de miles
  formatNumber(value: number): string {
    return value.toLocaleString('es-CO');
  }

  // Función para obtener el año de la última doceava
  getUltimaDoceavaYear(): number {
    return this.selectedVigencia ? parseInt(this.selectedVigencia.value) - 1 : 2024;
  }

  // Función para obtener el año de las once doceavas
  getOnceDoceavasYear(): number {
    return this.selectedVigencia ? parseInt(this.selectedVigencia.value) : 2025;
  }

  // Función para cargar datos de la tabla
  loadTableData(): void {
    this.isLoadingTable = true;
    
    // Simular carga de datos
    setTimeout(() => {
      this.treeTableData = [
        {
          data: {
            concepto: 'Educación',
            ultimaDoceava: 250000000,
            onceDoceavas: 275000000,
            total: 525000000
          },
          children: [
            {
              data: {
                concepto: 'Educación Preescolar',
                ultimaDoceava: 50000000,
                onceDoceavas: 55000000,
                total: 105000000
              }
            },
            {
              data: {
                concepto: 'Educación Básica',
                ultimaDoceava: 150000000,
                onceDoceavas: 165000000,
                total: 315000000
              }
            },
            {
              data: {
                concepto: 'Educación Media',
                ultimaDoceava: 50000000,
                onceDoceavas: 55000000,
                total: 105000000
              }
            }
          ]
        },
        {
          data: {
            concepto: 'Salud',
            ultimaDoceava: 180000000,
            onceDoceavas: 198000000,
            total: 378000000
          },
          children: [
            {
              data: {
                concepto: 'Atención Primaria',
                ultimaDoceava: 90000000,
                onceDoceavas: 99000000,
                total: 189000000
              }
            },
            {
              data: {
                concepto: 'Atención Especializada',
                ultimaDoceava: 90000000,
                onceDoceavas: 99000000,
                total: 189000000
              }
            }
          ]
        },
        {
          data: {
            concepto: 'Agua Potable y Saneamiento Básico',
            ultimaDoceava: 43931829,
            onceDoceavas: 48325011,
            total: 92256840
          }
        }
      ];
      this.isLoadingTable = false;
    }, 1000);
  }

  // Función para obtener el total de una columna
  getColumnTotal(column: string): number {
    let total = 0;
    this.calculateTotal(this.treeTableData, column, total);
    return total;
  }

  // Función recursiva para calcular totales
  private calculateTotal(nodes: TreeNode[], column: string, total: number): void {
    nodes.forEach(node => {
      if (node.data && node.data[column]) {
        total += node.data[column];
      }
      if (node.children) {
        this.calculateTotal(node.children, column, total);
      }
    });
  }

  // Métodos para descargas
  downloadData(): void {
    console.log('Descargando datos completos...');
    // Aquí se puede implementar la lógica de descarga de datos completos
  }

  downloadOnceDoceavas(): void {
    console.log('Descargando Once Doceavas del año:', this.getOnceDoceavasYear());
    // Aquí se puede implementar la lógica de descarga de once doceavas
  }

  downloadUltimaDoceava(): void {
    console.log('Descargando Última Doceava del año:', this.getUltimaDoceavaYear());
    // Aquí se puede implementar la lógica de descarga de última doceava
  }
}
