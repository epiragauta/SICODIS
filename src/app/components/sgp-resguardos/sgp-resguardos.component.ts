import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';

// Services & Pipes
import { SicodisApiService } from '../../services/sicodis-api.service';
import { ConfigService, FechaActualizacion } from '../../services/config.service';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

interface ResguardoData {
  vigencia: number;
  presupuesto: number;
  poblacion: number;
  cantidadResguardos: number;
}

@Component({
  selector: 'app-sgp-resguardos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    FloatLabel,
    InputTextModule,
    AccordionModule,
    NumberFormatPipe
  ],
  templateUrl: './sgp-resguardos.component.html',
  styleUrl: './sgp-resguardos.component.scss'
})
export class SgpResguardosComponent implements OnInit {

  // Filtros
  selectedVigencia: number = 2026;
  selectedDepartamento: string = '91';
  selectedMunicipio: string = '001';
  searchText: string = '';

  // Opciones para los filtros
  vigencias: any[] = [
    { id: 2026, label: '2026' },
    { id: 2025, label: '2025' },
    { id: 2024, label: '2024' },
    { id: 2023, label: '2023' },
    { id: 2022, label: '2022' }
  ];

  departamentos: any[] = [
    { id: '0', label: 'Todos' },
    { id: '91', label: 'Amazonas' },
    { id: '05', label: 'Antioquia' },
    { id: '25', label: 'Cundinamarca' },
    { id: '19', label: 'Cauca' },
    { id: '52', label: 'Nariño' }
  ];

  municipios: any[] = [
    { id: '0', label: 'Todos' },
    { id: '001', label: 'Leticia' }
  ];

  // Estados de carga
  isLoading = signal(false);

  // Fecha de actualización (desde ConfigService)
  fechaActualizacion: string = 'mayo 28 de 2026'; // Valor por defecto

  // Datos actuales
  presupuestoActual: number = 2966366220;
  poblacionActual: number = 3461;

  // Datos históricos
  datosHistoricos: ResguardoData[] = [
    { vigencia: 2026, presupuesto: 2966366220, poblacion: 3461, cantidadResguardos: 913 },
    { vigencia: 2025, presupuesto: 2639790000, poblacion: 3267, cantidadResguardos: 900 },
    { vigencia: 2024, presupuesto: 2354219331, poblacion: 3461, cantidadResguardos: 885 }
  ];

  // Población total histórica
  poblacionTotalHistorica: number = 1905617;

  // Enlaces de interés
  enlacesInteres = [
    {
      titulo: 'Ministerio de Hacienda y Crédito Público',
      url: 'https://www.minhacienda.gov.co'
    },
    {
      titulo: 'Departamento Nacional de Planeación',
      url: 'https://www.dnp.gov.co'
    },
    {
      titulo: 'Departamento Administrativo Nacional de Estadística',
      url: 'https://www.dane.gov.co'
    }
  ];

  constructor(
    private sicodisApiService: SicodisApiService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.loadFechaActualizacion();
    this.loadData();
  }

  private loadFechaActualizacion(): void {
    const fechas = this.configService.getSgpFechaResguardosSync();
    if (fechas && fechas.fecha_actualizacion) {
      this.fechaActualizacion = fechas.fecha_actualizacion;
    }
  }

  onVigenciaChange(): void {
    this.loadData();
  }

  onDepartamentoChange(): void {
    this.loadMunicipios();
    this.loadData();
  }

  onMunicipioChange(): void {
    this.loadData();
  }

  loadMunicipios(): void {
    // En producción, cargar municipios según el departamento seleccionado
    if (this.selectedDepartamento === '91') {
      this.municipios = [
        { id: '0', label: 'Todos' },
        { id: '001', label: 'Leticia' },
        { id: '263', label: 'El Encanto' },
        { id: '405', label: 'La Chorrera' },
        { id: '407', label: 'La Pedrera' },
        { id: '430', label: 'La Victoria' },
        { id: '460', label: 'Mirití-Paraná' },
        { id: '530', label: 'Puerto Alegría' },
        { id: '536', label: 'Puerto Arica' },
        { id: '540', label: 'Puerto Nariño' },
        { id: '669', label: 'Puerto Santander' },
        { id: '798', label: 'Tarapacá' }
      ];
    } else {
      this.municipios = [{ id: '0', label: 'Todos' }];
    }
    this.selectedMunicipio = '0';
  }

  loadData(): void {
    this.isLoading.set(true);

    // Simular carga de datos
    setTimeout(() => {
      const data = this.datosHistoricos.find(d => d.vigencia === this.selectedVigencia);

      if (data) {
        this.presupuestoActual = data.presupuesto;
        this.poblacionActual = data.poblacion;
      }

      this.isLoading.set(false);
    }, 500);
  }

  aplicarFiltros(): void {
    this.loadData();
  }

  limpiarFiltros(): void {
    this.selectedVigencia = 2026;
    this.selectedDepartamento = '91';
    this.selectedMunicipio = '001';
    this.searchText = '';
    this.loadData();
  }

  exportarExcel(): void {
    console.log('Exportando a Excel...');
    // Implementar exportación de datos
    alert('Funcionalidad de exportación en desarrollo');
  }

  // Métodos auxiliares para cálculos
  get diferenciaPresupuesto(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].presupuesto - this.datosHistoricos[1].presupuesto;
  }

  get porcentajeVariacionPresupuesto(): number {
    if (this.datosHistoricos.length < 2 || this.datosHistoricos[1].presupuesto === 0) return 0;
    return ((this.datosHistoricos[0].presupuesto - this.datosHistoricos[1].presupuesto) / this.datosHistoricos[1].presupuesto) * 100;
  }

  get diferenciaPoblacion(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].poblacion - this.datosHistoricos[1].poblacion;
  }

  get porcentajeVariacionPoblacion(): number {
    if (this.datosHistoricos.length < 2 || this.datosHistoricos[1].poblacion === 0) return 0;
    return ((this.datosHistoricos[0].poblacion - this.datosHistoricos[1].poblacion) / this.datosHistoricos[1].poblacion) * 100;
  }

  get diferenciaResguardos(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].cantidadResguardos - this.datosHistoricos[1].cantidadResguardos;
  }
}
