import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SicodisApiService } from '../../services/sicodis-api.service';

@Component({
  selector: 'app-pgn-inversion-por-sector',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    FloatLabel, 
    Select,
    ButtonModule],
  templateUrl: './pgn-inversion-por-sector.component.html',
  styleUrl: './pgn-inversion-por-sector.component.scss'
})
export class PgnInversionPorSectorComponent implements OnInit {


  // Data arrays
  vigencias: any[] = [];
  periodos: any[] = [];
  departamentos: any[] = [];
  fuentes: any[] = [];

  // Filter properties
  selectedVigencia: any;
  selectedPeriodo: any;
  selectedDepartamento: any;
  selectedFuente: any;

  // Loading state
  isLoading = false;

  constructor(private sicodisApiService: SicodisApiService) {}

  ngOnInit(): void {
    
    this.loadVigencias();
  }

  /**
   * Carga las vigencias disponibles desde la API
   */
  loadVigencias(): void {
    this.sicodisApiService.getSgpVigenciasPresupuestoUltimaOnce().subscribe({
      next: (vigencias) => {
        console.log('Vigencias cargadas:', vigencias);
        this.vigencias = vigencias;
        
      },
      error: (error) => {
        console.error('Error cargando vigencias:', error);
        this.vigencias = [];
      }
    });
  }

  onActualizar(): void {
    console.log('Actualizando datos...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Periodo:', this.selectedPeriodo);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Fuente:', this.selectedFuente);

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Datos actualizados');
    }, 2000);
  }

  clearFilters(): void {
    this.selectedVigencia = this.vigencias[0];
    this.selectedPeriodo = this.periodos[0];
    this.selectedDepartamento = null;
    this.selectedFuente = null;
    console.log('Filtros limpiados');
  }

  onVigenciaChange(event: SelectChangeEvent): void {
      console.log('Vigencia seleccionada:', event.value);
      this.selectedVigencia = event.value;
    }
  
  onPeriodoChange(event: SelectChangeEvent): void {
    console.log('Periodo seleccionado:', event.value);
    this.selectedPeriodo = event.value;
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedDepartamento = event.value;
  }

  onFuenteChange(event: SelectChangeEvent): void {
    console.log('Fuente seleccionada:', event.value);
    this.selectedFuente = event.value;
  }

}
