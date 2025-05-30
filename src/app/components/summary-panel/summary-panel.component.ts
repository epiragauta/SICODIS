import { Component, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

@Component({
  selector: 'app-summary-panel',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, NumberFormatPipe],
  templateUrl: './summary-panel.component.html',
  styleUrls: ['./summary-panel.component.scss']
})
export class SummaryPanelComponent implements OnChanges {
  @Input() summaryData: any;

  // Properties for individual statistics
  totalPresupuestoVigente: number = 0;
  inversionPresupuestoVigente: number = 0;
  ahorroPresupuestoVigente: number = 0;
  otrosPresupuestoVigente: number = 0;
  inversionPresupuestoCorriente: number = 0;
  ahorroPresupuestoCorriente: number = 0;
  otrosPresupuestoCorriente: number = 0;

  // Properties for chart data and options
  pieChartData: any;
  pieChartOptions: any;
  barChartData: any;
  barChartOptions: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Minimal constructor, options will be fully set in init methods
    this.pieChartOptions = {};
    this.barChartOptions = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summaryData'] && this.summaryData) {
      if (isPlatformBrowser(this.platformId)) { // Ensure this runs only in browser
        this.processData();
      }
    }
  }

  private processData(): void {
    if (this.summaryData) {
      this.totalPresupuestoVigente = this.summaryData.totalVigente || 0;
      this.inversionPresupuestoVigente = this.summaryData.inversionVigente || 0;
      this.ahorroPresupuestoVigente = this.summaryData.ahorroVigente || 0;
      this.otrosPresupuestoVigente = this.summaryData.otrosVigente || 0;
      this.inversionPresupuestoCorriente = this.summaryData.inversionCorriente || 0;
      this.ahorroPresupuestoCorriente = this.summaryData.ahorroCorriente || 0;
      this.otrosPresupuestoCorriente = this.summaryData.otrosCorriente || 0;

      this.initPieChart();
      this.initBarChart();
    }
  }

  private initPieChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.pieChartData = {
      labels: ['INVERSIÓN', 'AHORRO', 'OTROS'],
      datasets: [
        {
          data: [
            this.inversionPresupuestoVigente,
            this.ahorroPresupuestoVigente,
            this.otrosPresupuestoVigente
          ],
          backgroundColor: [
            '#6699FF',
            '#1A3366',
            '#4F81BD'
          ],
          hoverBackgroundColor: [
            '#4B0082',
            '#40E0D0',
            '#ADDFFF'
          ]
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: documentStyle.getPropertyValue('--text-color') || '#495057'
          },
          position: 'bottom'
        }
      }
    };
  }

  private initBarChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.barChartData = {
      labels: ['INVERSIÓN', 'AHORRO', 'OTROS'],
      datasets: [
        {
          label: 'Presupuesto Corriente',
          backgroundColor: ['#6699FF','#1A3366','#4F81BD'],
          borderColor: '#7CB9E8',
          data: [
            this.inversionPresupuestoCorriente,
            this.ahorroPresupuestoCorriente,
            this.otrosPresupuestoCorriente
          ]
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: documentStyle.getPropertyValue('--text-color') || '#495057'
          },
          position: 'top' // Or 'bottom'
        }
      },
      scales: {
        x: {
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary') || '#6C757D'
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border') || '#DEE2E6'
          }
        },
        y: {
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary') || '#6C757D',
            callback: function(value: number) { // Format y-axis ticks as currency
               if (value >= 1.0e+12) return (value / 1.0e+12).toFixed(1) + "T";
               if (value >= 1.0e+9) return (value / 1.0e+9).toFixed(1) + "B";
               if (value >= 1.0e+6) return (value / 1.0e+6).toFixed(1) + "M";
               if (value >= 1.0e+3) return (value / 1.0e+3).toFixed(1) + "K";
               return value.toString();
            }
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border') || '#DEE2E6'
          }
        }
      }
    };
  }
}
