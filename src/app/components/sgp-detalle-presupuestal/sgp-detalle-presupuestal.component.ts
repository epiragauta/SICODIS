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
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

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
    TreeTableModule,
    Breadcrumb
  ],
  templateUrl: './sgp-detalle-presupuestal.component.html',
  styleUrl: './sgp-detalle-presupuestal.component.scss'
})
export class SgpDetallePresupuestalComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  fechaActual = (() => {
  const fecha = new Date();
  const meses = [
     'enero','febrero','marzo','abril','mayo','junio',
     'julio','agosto','septiembre','octubre','noviembre','diciembre'
   ];
  return `${meses[fecha.getMonth()]} ${fecha.getDate()} de ${fecha.getFullYear()}`;
  })();  
  
  // Filtros
  selectedVigencia: any = null;
  selectedDepartamento: any = null;
  selectedMunicipio: any = null;

  // Opciones para los filtros
  vigencias: any[] = [];

  departamentos: any[] = [];

  municipios: any[] = [];

  // Datos de la tarjeta
  totalAsignado: number = 0;
  ultimaDoceava: number = 0;
  onceDoceava: number = 0;

  cifras: any = {
    onceDoceava: 79849334012202,
    ultimaDoceava: 2134848615360,
    totalAsignado: 81984182627562
  };
  isLoading: boolean = false;

  yearUltimaDoceava: string = '2024';

  // Datos de la tabla
  treeTableData: TreeNode[] = [];
  isLoadingTable: boolean = false;
  
  // Estado de carga para municipios
  isLoadingMunicipios: boolean = false;

  constructor(private sicodisApiService: SicodisApiService) { }

  async ngOnInit(): Promise<void> {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Detalle Presupuestal' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    
    //this.initializeDepartamentos();
    //this.loadVigenciasFromAPI();
    this.cargarVigencias();
    await this.cargarDepartamentos();

    this.selectedVigencia = this.vigencias[0].id;
    this.selectedDepartamento = this.departamentos[0].id;

    /// Inicializa en TODOS los municipios
    const municipios = [
                          { codigo: '0', nombre: 'Todos' },
                       ];

    this.municipios = municipios.map(m => ({
      id: m.codigo,
      label: m.nombre
    }));

    this.selectedMunicipio = '0';    

    this.loadSgpData();
    this.loadTableData();

  }


  loadSgpData(): void {
    console.log("loadSgpData...");
    this.isLoading = true;
    const year = this.selectedVigencia;
    this.sicodisApiService.getSgpResumenGeneralUltimaOnce(year, this.selectedDepartamento,this.selectedMunicipio).subscribe({
      next: (result: any) => {
        let resumen = result[0];
        //this.fechaActualizacion = this.formatFecha(new Date(resumen.fecha_ultima_actualizacion));
        this.cifras = {
          totalAsignado: resumen.Total,
          ultimaDoceava: resumen.UltimaDoceava,
          onceDoceava: resumen.OnceDoceavas
        };
        //this.loadSgpParticipaciones();
      },
      error: (error) => {
        console.error('Error loading SGP data:', error);
        // Mantener datos por defecto en caso de error
        this.cifras = {
          presupuesto: 70540879911189,
          distribuido: 65200000000000,
          pendiente: 5330879911189,
          avance: 100
        };
        //this.loadSgpParticipaciones();
      },
        complete: () => {
        this.isLoading = false;  // AQUÍ SE APAGA EL LOADING
      }
    });
  }


  /**
   * Cargar datos desde la API para inicializar el formulario
   */
  private async cargarVigencias(): Promise<void> {
    try {
      const vigencias = await this.sicodisApiService.getSgpVigenciasPresupuestoUltimaOnce().toPromise();
      this.vigencias = vigencias?.map((vigencia: any) => ({
        id: vigencia.id_vigencia,
        label: vigencia.vigencia
      })) || [];
      
      // Seleccionar la primera vigencia por defecto
      if (this.vigencias.length > 0) {
        this.selectedVigencia = this.vigencias[0];
        console.log('Vigencia seleccionada por defecto:', this.selectedVigencia);
      }
      
      console.log('Vigencias cargadas desde API:', this.vigencias);
    } catch (error) {
      console.warn('Error cargando vigencias desde API, se usarán datos locales como fallback:', error);
      this.vigencias = [];
    }
  }

      /**
   * Cargar datos departamentos desde la API 
   */
  private async cargarDepartamentos(): Promise<void> {
    try {
      const departamentosLista = await this.sicodisApiService.getSgpDepartamentos().toPromise();
      this.departamentos = departamentosLista?.map((dept: any) => ({
        id: dept.codigo,
        label: dept.nombre
      })) || [];
      
      // Seleccionar la primera vigencia por defecto
      if (this.departamentos.length > 0) {
        this.selectedDepartamento = this.departamentos[0];
        console.log('Departamento seleccionada por defecto:', this.selectedDepartamento);
      }
      
      console.log('Departamento cargadas desde API:', this.departamentos);
    } catch (error) {
      console.warn('Error cargando departamentos desde API, se usarán datos locales como fallback:', error);
      this.departamentos = [];
    }
  }

  private async loadTownsForDepartment(): Promise<void> {
    if (!this.selectedDepartamento) {
      //this.towns = [];
      this.selectedMunicipio = '0';
      return;
    }
    console.log('Cargando municipios para departamento:', this.selectedDepartamento);
    const municipiosLista = await this.sicodisApiService.getMunicipiosDepartamentosSgp(this.selectedDepartamento).toPromise();
    this.municipios = municipiosLista?.map((town: any) => ({
       id: town.codigo,
       label: town.nombre
    })) || [];


      // Seleccionar la primera vigencia por defecto
      if (this.municipios.length > 0) {
        this.selectedMunicipio = this.municipios[0].id;
        console.log('Municipio seleccionada por defecto:', this.selectedMunicipio);
      }

  }

  

  // private initializeDepartamentos(): void {
  //   this.departamentos = departamentos.map(dept => ({
  //     label: dept.nombre,
  //     value: dept.codigo
  //   }));
  // }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.loadSgpData();
    this.loadTableData();
    // this.yearUltimaDoceava = (parseInt(event.value.label  ) - 1).toString();
    // // Si ya hay un municipio seleccionado, actualizar las métricas
    // if (this.selectedMunicipio && this.selectedDepartamento) {
    //   this.loadMunicipioData();
    // }
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    // this.selectedMunicipio = null;
    // this.municipios = [];
    
    // Reset metrics to default values when department changes
    //this.resetMetricsToDefault();
    console.log('Departamento seleccionado:', event.value);
    this.selectedDepartamento = event.value;
    //this.townSelected = '';
    this.loadTownsForDepartment();
    this.loadSgpData();
    this.loadTableData();
    
    // if (event.value) {
    //   this.isLoadingMunicipios = true;
      
    //   this.sicodisApiService.getMunicipiosPorDepartamento(event.value).subscribe({
    //     next: (municipios) => {
    //       console.log('Municipios cargados:', municipios);
    //       this.municipios = municipios.map(municipio => ({
    //         label: municipio.nombre_municipio || 'Municipio sin nombre',
    //         value: municipio.codigo_municipio
    //       }));
    //       this.isLoadingMunicipios = false;
    //     },
    //     error: (error) => {
    //       console.error('Error cargando municipios:', error);
    //       this.municipios = [];
    //       this.isLoadingMunicipios = false;
    //     }
    //   });
    // }
  }

  private resetMetricsToDefault(): void {
    this.totalAsignado = 5687181948;
    this.ultimaDoceava = 473931829;
    this.onceDoceava = 521325011;
  }

  onMunicipioChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    // Reset metrics to default values when department changes
    console.log('Departamento seleccionado:', event.value);
    this.selectedMunicipio = event.value;
    //this.townSelected = '';
    this.loadSgpData();
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

    //this.cargarVigencias();
    //this.cargarDepartamentos();

   this.selectedVigencia = this.vigencias[0].id;
    this.selectedDepartamento = this.departamentos[0].id;

    /// Inicializa en TODOS los municipios
    const municipios = [
                          { codigo: '0', nombre: 'Todos' },
                       ];

    this.municipios = municipios.map(m => ({
      id: m.codigo,
      label: m.nombre
    }));

    this.selectedMunicipio = '0';    

    this.loadSgpData();
    this.loadTableData();

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
    const idVigencia = parseInt(this.selectedVigencia);
    
    this.sicodisApiService.getSgpResumenParticipacionesUltimaOnce(idVigencia, this.selectedDepartamento,this.selectedMunicipio
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
    console.log('Exportando a Excel...');
    console.log('Actualizando datos...');   
    this.descargarDatosDistribucionUltimayOnce();
  }

  /**
   * Descarga del archivo excel de acuerdo con los datos del filtro
   */
  private async descargarDatosDistribucionUltimayOnce(): Promise<void> {
    try {
     
	    // Usar método histórico original
      console.log('Descargando  datos ultima y once');
  	  const idvigencia = this.selectedVigencia;
      const vigencia = this.vigencias.find(d => d.id === idvigencia);
	    
      const selectedDepartamento = this.departamentos.find(d => d.id === this.selectedDepartamento);
      const selectedMunicipio = this.municipios.find(d => d.id === this.selectedMunicipio);

      const archivo: Blob | undefined = await this.sicodisApiService.getSgpDescargarResumenParticipacionesUltimaOnce( idvigencia
                                                                                                                     , vigencia.label
                                                                                                                     , selectedDepartamento.id
                                                                                                                     , selectedMunicipio.id
                                                                                                                     , selectedDepartamento.label
                                                                                                                     , selectedMunicipio.label).toPromise();

      // Verificamos que sí tengamos archivo
      if (!archivo) {
        console.warn('No se recibió ningún archivo desde el servicio');
        return;
      }


      // Forzar tipo MIME correcto para Excel
      const excelBlob = new Blob([archivo], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const arrayBuffer = await excelBlob.arrayBuffer();
      console.log('Tamaño de archivo:', arrayBuffer.byteLength);

      // Crear enlace temporal para descargar
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;

      const nombreArchivo = `ResumenDistribucionSGPUltimaYOnce.xlsx`;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('Archivo descargado exitosamente');



    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
    }
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
