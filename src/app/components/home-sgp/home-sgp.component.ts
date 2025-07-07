import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home-sgp',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    Select,
    FloatLabel,
    FormsModule,
    ChartModule,
  ],
  templateUrl: './home-sgp.component.html',
  styleUrl: './home-sgp.component.scss'
})
export class HomeSgpComponent implements OnInit {
  
  private platformId = inject(PLATFORM_ID);
  
  pieChartOptions: any;
  pieChartData: any;

  departamentos: SelectOption[] = [
    { value: 'amazonas', label: 'Amazonas' },
    { value: 'bolivar', label: 'Bolívar' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'casanare', label: 'Casanare' },
    { value: 'cesar', label: 'Cesar' },
    { value: 'cundinamarca', label: 'Cundinamarca' }
  ];

  municipios: SelectOption[] = [
    { value: 'municipio1', label: 'Municipio1' },
    { value: 'municipio2', label: 'Municipio2' },
    { value: 'municipio3', label: 'Municipio3' },
    { value: 'municipio4', label: 'Municipio4' },
    { value: 'municipio5', label: 'Municipio5' },
    { value: 'municipio6', label: 'Municipio6' }
  ];

  anos: SelectOption[] = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];

  selectedDepartamento: SelectOption | null = null;
  selectedMunicipio: SelectOption | null = null;
  selectedAno: SelectOption | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializePieChart();
      }, 100);
    }
  }

  private initializePieChart(): void {

    // Colores basados en los utilizados en reporte-funcionamiento
    const chartColors = [
      '#6699FF', // Azul cielo - Educación
      '#1A3366', // Azul marino - Salud  
      '#4F81BD'  // Azul acero - Agua potable
    ];

    this.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#06177f',
              font: {
                size: 12
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        }
      };

    this.pieChartData =  {
        labels: ['Educación', 'Salud', 'Agua Potable'],
        datasets: [{
          data: [35, 35, 30],
          backgroundColor: chartColors,
          hoverBackgroundColor: [
            '#4B0082', // Azul índigo para hover
            '#40E0D0', // Azul turquesa para hover
            '#ADDFFF'  // Azul pálido para hover
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };

  }
}