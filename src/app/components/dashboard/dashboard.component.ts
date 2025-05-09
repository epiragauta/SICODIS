import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SplitterModule } from 'primeng/splitter';
import { BehaviorSubject, Observable } from 'rxjs';
import { BudgetItem, BudgetServiceStatic } from './budget.service';
//import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BudgetChartComponent } from './budget-chart.component';
import { BudgetMapComponent } from './budget-map.component';
import { ChartModule } from 'primeng/chart';
import { layouts } from 'chart.js';

// Importamos el custom element
//import './budget-chart-element';

interface CardData {
  title: string;
  cols: number;
  rows: number;
  value?: number;
  formattedValue?: string;
  category?: string;
  color?: string;
  percentaje?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SplitterModule,
    BudgetChartComponent,
    BudgetMapComponent,
    ChartModule
  ],
  providers: [
    BudgetServiceStatic
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private budgetService = inject(BudgetServiceStatic);
  platformId = inject(PLATFORM_ID);

  // Datos del presupuesto
  budgetData: BudgetItem[] = [];
  totalSGP: number = 0;
  distributedResources: number = 0;
  pendingResources: number = 0;
  distributionPercentage: number = 0;

  // Sujetos para las tarjetas
  private cardsStatisticsSubject = new BehaviorSubject<CardData[]>([]);
  cardsStatistics: Observable<CardData[]> = this.cardsStatisticsSubject.asObservable();

  private cardsSummarySubject = new BehaviorSubject<CardData[]>([]);
  cardsSummary: Observable<CardData[]> = this.cardsSummarySubject.asObservable();

  chartData: any;
  chartOptions: any;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBudgetData();
    this.initChart(); // Inicializa el gráfico
    // setupCards() se llamará después de cargar los datos
  }

  loadBudgetData() {
    this.budgetService.getBudgetData().subscribe(data => {
      this.budgetData = data;

      // Calcular valores importantes
      const totalSGPItem = this.budgetData.find(item => item.desc === 'Total SGP');
      this.totalSGP = totalSGPItem ? totalSGPItem.value : 0;

      // Para este ejemplo, asumimos que los recursos distribuidos son iguales al Total SGP
      this.distributedResources = this.totalSGP;

      // Recursos pendientes (en este caso 0, pero podría cambiar según requerimientos)
      this.pendingResources = 0;

      // Porcentaje de distribución
      this.distributionPercentage = this.totalSGP > 0 ? (this.distributedResources / this.totalSGP) * 100 : 0;

      // Actualizar las tarjetas después de cargar los datos
      this.setupCards();
    });
  }

  setupCards() {
    this.setupStatisticsCards();
    this.setupSummaryCards();
  }

  setupStatisticsCards() {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        // Filtrar los elementos que no son 'Total SGP'
        const items = this.budgetData.filter(item => item.desc !== 'Total SGP');

        return items.map(item => {
          return {
            title: item.desc,
            cols: matches ? 4 : 1,  // Ocupa todo el ancho en modo móvil
            rows: 1,
            value: item.value,
            formattedValue: this.formatCurrency(item.value),
            category: 'budget-item',
            color: this.getRandomColor()
          };
        });
      })
    ).subscribe(cards => {
      this.cardsStatisticsSubject.next(cards);
    });
  }

  setupSummaryCards() {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        const cardSize = matches ? 4 : 1;
        return [
          {
            title: 'Total SGP',
            cols: cardSize,
            rows: 1,
            value: this.totalSGP,
            formattedValue: this.formatCurrency(this.totalSGP),
            category: 'total',
            color: '#4CAF50'
          },
          {
            title: 'Recursos distribuidos a la fecha',
            cols: cardSize,
            rows: 1,
            value: this.distributedResources,
            formattedValue: this.formatCurrency(this.distributedResources),
            category: 'distributed',
            color: '#2196F3'
          },
          {
            title: 'Avance de distribución',
            cols: cardSize,
            rows: 2,
            value: this.distributionPercentage,
            formattedValue: `${this.distributionPercentage.toFixed(2)}%`,
            category: 'percentage',
            color: '#9C27B0'
          },
          {
            title: 'Recursos pendientes por distribuir',
            cols: cardSize,
            rows: 2,
            value: this.pendingResources,
            formattedValue: this.formatCurrency(this.pendingResources),
            category: 'pending',
            color: '#FFC107'
          },
        ];
      })
    ).subscribe(cards => {
      this.cardsSummarySubject.next(cards);
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getRandomColor(): string {
    const colors = ['#3F51B5', '#673AB7', '#009688', '#795548', '#FF5722', '#607D8B', '#E91E63'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  initChart() {
    console.log('initChart() called');
    if (isPlatformBrowser(this.platformId)) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');

        this.chartData = {
            datasets: [
                {
                    data: [100],
                    backgroundColor: ["#2196F3"],
                    hoverBackgroundColor: ["#1976D2"]
                }
            ]
        };

        this.chartOptions = {
          responsive: true,
          rotation: -90,
          circumference: 180,
          cutout: '80%',
          maintainAspectRatio: true,
          aspectRatio: 2,
          layout: {
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          },
          plugins: {
            tooltip: {
              enabled: true,
            },
            legend: {
              display: true,
            },
          },
        };
        this.cd.markForCheck()
    }
}
}
