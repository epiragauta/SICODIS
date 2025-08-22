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
import { SicodisApiService } from '../../services/sicodis-api.service';
import { departamentos } from '../../data/departamentos';

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
  vigencias: any[] = [];

  departamentos: any[] = [];

  municipios: any[] = [];

  // Datos de la tarjeta
  totalAsignado: number = 5687181948;
  ultimaDoceava: number = 473931829;
  onceDoceava: number = 521325011;

  yearUltimaDoceava: string = '2024';

  // Datos de la tabla
  treeTableData: TreeNode[] = [];
  isLoadingTable: boolean = false;
  
  // Estado de carga para municipios
  isLoadingMunicipios: boolean = false;

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.initializeDepartamentos();
    this.loadVigenciasFromAPI();
  }

  private initializeDepartamentos(): void {
    this.departamentos = departamentos.map(dept => ({
      label: dept.nombre,
      value: dept.codigo
    }));
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.loadTableData();
    this.yearUltimaDoceava = (parseInt(event.value.label  ) - 1).toString();
    // Si ya hay un municipio seleccionado, actualizar las métricas
    if (this.selectedMunicipio && this.selectedDepartamento) {
      this.loadMunicipioData();
    }
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedMunicipio = null;
    this.municipios = [];
    
    // Reset metrics to default values when department changes
    this.resetMetricsToDefault();
    
    if (event.value) {
      this.isLoadingMunicipios = true;
      
      this.sicodisApiService.getMunicipiosPorDepartamento(event.value).subscribe({
        next: (municipios) => {
          console.log('Municipios cargados:', municipios);
          this.municipios = municipios.map(municipio => ({
            label: municipio.nombre_municipio || 'Municipio sin nombre',
            value: municipio.codigo_municipio
          }));
          this.isLoadingMunicipios = false;
        },
        error: (error) => {
          console.error('Error cargando municipios:', error);
          this.municipios = [];
          this.isLoadingMunicipios = false;
        }
      });
    }
  }

  private resetMetricsToDefault(): void {
    this.totalAsignado = 5687181948;
    this.ultimaDoceava = 473931829;
    this.onceDoceava = 521325011;
  }

  onMunicipioChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.loadMunicipioData();
    this.loadTableData();
  }

  private loadMunicipioData(): void {
    if (!this.selectedMunicipio || !this.selectedDepartamento || !this.selectedVigencia) {
      return;
    }

    const idVigencia = parseInt(this.selectedVigencia.value);
    
    this.sicodisApiService.getSgpResumenGeneralUltimaOnce(
      idVigencia, 
      this.selectedDepartamento, 
      this.selectedMunicipio
    ).subscribe({
      next: (resumen: any) => {
        console.log('Resumen cargado para municipio:', resumen);
        this.updateMetricsFromApi(resumen[0]);
      },
      error: (error) => {
        console.error('Error cargando resumen del municipio:', error);
        // Mantener valores por defecto en caso de error
      }
    });
  }

  private updateMetricsFromApi(resumen: any): void {
    // Calcular métricas basadas en los datos del API
    this.totalAsignado = resumen.Total || 0;
    
    
    // Última doceava (del año anterior)
    this.ultimaDoceava = resumen.UltimaDoceava || 0;
    
    // Once doceavas (del año actual)
    this.onceDoceava = resumen.OnceDoceavas || 0;
  }

  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Municipio:', this.selectedMunicipio);
    
    // Aquí se puede agregar lógica para aplicar los filtros y cargar datos
  }

  private loadVigenciasFromAPI(): void {
    this.sicodisApiService.getSgpVigenciasPresupuestoUltimaOnce().subscribe({
      next: (vigencias: any[]) => {
        console.log('Vigencias cargadas desde API:', vigencias);
        this.vigencias = vigencias.map(vigencia => ({
          label: vigencia.vigencia,
          value: vigencia.id_vigencia.toString()
        }));
        
        // Set default value (first year or 2025)
        if (this.vigencias.length > 0) {
          this.selectedVigencia = this.vigencias[0];
        }
        
        this.loadTableData();
      },
      error: (error) => {
        console.error('Error cargando vigencias desde API:', error);
        // Fallback to default years
        this.vigencias = [
          { label: '2025', value: '2025' },
          { label: '2024', value: '2024' },
          { label: '2023', value: '2023' },
          { label: '2022', value: '2022' },
          { label: '2021', value: '2021' },
          { label: '2020', value: '2020' }
        ];
        this.selectedVigencia = this.vigencias[0];
        this.loadTableData();
      }
    });
  }

  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.selectedVigencia = this.vigencias.length > 0 ? this.vigencias[0] : null;
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipios = [];
    
    // Reset metrics to default values
    this.resetMetricsToDefault();
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
    
    // Si hay municipio seleccionado, usar API
    if (this.selectedMunicipio && this.selectedDepartamento && this.selectedVigencia) {
      this.loadTableDataFromApi();
    } else {
      // Datos por defecto si no hay municipio seleccionado
      this.loadDefaultTableData();
    }
  }

  private loadTableDataFromApi(): void {
    const idVigencia = parseInt(this.selectedVigencia.value);
    
    this.sicodisApiService.getSgpResumenParticipacionesUltimaOnce(
      idVigencia,
      this.selectedDepartamento,
      this.selectedMunicipio
    ).subscribe({
      next: (data: any) => {
        console.log('Datos de participaciones cargados:', data);
        this.buildTreeTableFromApi(data);
        this.isLoadingTable = false;
      },
      error: (error) => {
        console.error('Error cargando datos de participaciones:', error);
        this.loadDefaultTableData();
      }
    });
  }

  private buildTreeTableFromApi(apiData: any[]): void {
    if (!apiData || apiData.length === 0) {
      this.treeTableData = [];
      return;
    }

    // Separar elementos principales (4 dígitos) y hijos (más de 4 dígitos)
    // Excluir IdConcepto = 99 para evitar duplicación con Total General del footer
    const mainConcepts = apiData.filter(item => 
      item.IdConcepto && item.IdConcepto.length === 4 && item.IdConcepto !== '99'
    );
    const childConcepts = apiData.filter(item => 
      item.IdConcepto && item.IdConcepto.length > 4
    );

    // Construir jerarquía
    const treeData: TreeNode[] = [];

    mainConcepts.forEach(mainConcept => {
      // Buscar hijos que empiecen con el código del concepto principal
      const children = childConcepts
        .filter(child => child.IdConcepto.startsWith(mainConcept.IdConcepto))
        .map(child => ({
          data: {
            concepto: child.Concepto,
            ultimaDoceava: child.UltimaDoceava || 0,
            onceDoceavas: child.OnceDoceavas || 0,
            total: child.Total || 0
          },
          leaf: true
        }));

      const mainNode: TreeNode = {
        data: {
          concepto: mainConcept.Concepto,
          ultimaDoceava: mainConcept.UltimaDoceava || 0,
          onceDoceavas: mainConcept.OnceDoceavas || 0,
          total: mainConcept.Total || 0
        },
        children: children.length > 0 ? children : undefined,
        expanded: false
      };

      treeData.push(mainNode);
    });

    this.treeTableData = treeData;
  }

  private loadDefaultTableData(): void {
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
    // Calcular el total sumando solo los conceptos principales (no los hijos)
    let total = 0;
    this.treeTableData.forEach(node => {
      if (node.data && node.data[column] && !node.data.isTotal) {
        total += node.data[column];
      }
    });
    return total;
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
