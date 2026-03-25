import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SicodisApiService, MunicipioEficiencia, ResumenMunicipioEficiencia } from '../../services/sicodis-api.service';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-eficiencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    TableModule,
    ProgressSpinnerModule,
    MessageModule,
    ButtonModule,
    DividerModule,
    TagModule
  ],
  templateUrl: './eficiencia.component.html',
  styleUrl: './eficiencia.component.scss'
})
export class EficienciaComponent implements OnInit {
  // Signals para estado reactivo
  municipios = signal<MunicipioEficiencia[]>([]);
  resumen = signal<ResumenMunicipioEficiencia | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Municipio seleccionado
  selectedMunicipio: MunicipioEficiencia | null = null;

  // Municipios principales de ejemplo
  municipiosPrincipales = [
    { codigo_dane: '05001', nombre: 'Medellín' },
    { codigo_dane: '76001', nombre: 'Cali' },
    { codigo_dane: '11001', nombre: 'Bogotá D.C.' },
    { codigo_dane: '08001', nombre: 'Barranquilla' },
    { codigo_dane: '13001', nombre: 'Cartagena' }
  ];

  constructor(private apiService: SicodisApiService) {}

  ngOnInit() {
    this.loadMunicipios();
  }

  /**
   * Cargar catálogo de municipios
   */
  loadMunicipios() {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.getEficienciasMunicipios().subscribe({
      next: (data) => {
        this.municipios.set(data);
        this.isLoading.set(false);
        console.log('Municipios cargados:', data.length);
      },
      error: (err) => {
        console.error('Error cargando municipios:', err);
        this.error.set('Error al cargar los municipios: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Cargar resumen completo de un municipio
   */
  loadResumen(codigoDane: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.resumen.set(null);

    this.apiService.getEficienciasResumenMunicipio(codigoDane).subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.isLoading.set(false);
        console.log('Resumen cargado para:', data.municipio.municipio);
      },
      error: (err) => {
        console.error('Error cargando resumen:', err);
        this.error.set('Error al cargar el resumen: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Evento cuando se selecciona un municipio del dropdown
   */
  onMunicipioChange(event: any) {
    if (this.selectedMunicipio) {
      this.loadResumen(this.selectedMunicipio.codigo_dane);
    }
  }

  /**
   * Cargar municipio rápido (desde botones)
   */
  loadMunicipioRapido(codigoDane: string) {
    this.loadResumen(codigoDane);
  }

  /**
   * Formatear valor monetario
   */
  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Formatear valor numérico con separadores de miles
   */
  formatNumber(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO').format(value);
  }

  /**
   * Formatear porcentaje
   */
  formatPercent(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return (value * 100).toFixed(2) + '%';
  }
}
