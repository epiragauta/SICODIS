import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
import { BudgetItem, BudgetServiceStatic } from '../dashboard/budget.service'; // Adjusted path
import { HighchartsChartComponent } from './highcharts-chart.component'; // Added
import { BudgetMapComponent } from '../dashboard/budget-map.component'; // Kept from original

interface CardData {
  title: string;
  cols: number;
  rows: number;
  value?: number;
  formattedValue?: string;
  category?: string;
  color?: string;
  percent: number;
  icon?: string;
}

@Component({
  selector: 'app-highcharts-dashboard', // Changed selector
  templateUrl: './highcharts-dashboard.component.html', // Changed template URL
  styleUrls: ['./highcharts-dashboard.component.scss'], // Changed style URL
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SplitterModule,
    HighchartsChartComponent, // Added
    BudgetMapComponent, 
  ],
  providers: [
    BudgetServiceStatic
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class HighchartsDashboardComponent implements OnInit { // Changed class name
  private breakpointObserver = inject(BreakpointObserver);
  private budgetService = inject(BudgetServiceStatic);
  platformId = inject(PLATFORM_ID);

  budgetData: BudgetItem[] = [];
  totalSGP: number = 0;
  distributedResources: number = 0;
  pendingResources: number = 0;
  distributionPercentage: number = 0;

  private cardsStatisticsSubject = new BehaviorSubject<CardData[]>([]);
  cardsStatistics: Observable<CardData[]> = this.cardsStatisticsSubject.asObservable();

  private cardsSummarySubject = new BehaviorSubject<CardData[]>([]);
  cardsSummary: Observable<CardData[]> = this.cardsSummarySubject.asObservable();

  mainChartData: any;
  mainChartType: string = 'bar'; // Default chart type, can be changed

  private categoryIcons: { [key: string]: string } = {
    'Educación': 'school',
    'Salud': 'local_hospital',
    'Agua Potable': 'water_drop',
    'Propósito General': 'public',
    'Alimentación Escolar': 'restaurant',
    'Ribereños': 'water',
    'Resguardos Indígenas': 'groups',
    'Fonpet Asignaciones Especiales': 'account_balance',
    'default': 'attach_money'
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.budgetService.getBudgetData().subscribe(data => {
      this.budgetData = data;
      const totalSGPItem = this.budgetData.find(item => item.desc === 'Total SGP');
      this.totalSGP = totalSGPItem ? totalSGPItem.value : 0;
      this.distributedResources = this.totalSGP; // Assuming all SGP is distributed for this example
      this.pendingResources = 0; // Assuming no pending resources for this example
      this.distributionPercentage = this.totalSGP > 0 ? (this.distributedResources / this.totalSGP) * 100 : 0;
      
      this.setupCards();
      this.prepareMainChartData(); 
      this.cd.detectChanges(); // Ensure view updates after data load
    });
  }
  
  prepareMainChartData() {
    const filteredData = this.budgetData.filter(item => item.desc !== 'Total SGP');
    if (this.mainChartType === 'bar') {
        // Format for Highcharts bar chart: array of objects { name, y }
        this.mainChartData = filteredData.map(item => ({ 
            name: item.desc, 
            y: item.value // Use full peso values
        }));
    } else if (this.mainChartType === 'pie') {
        // Format for Highcharts pie chart: array of objects { name, y }
        this.mainChartData = filteredData.map(item => ({ 
            name: item.desc, 
            y: item.value // Use full peso values
        }));
    }
    // console.log('Main chart data prepared:', this.mainChartData);
  }

  setupCards() {
    this.setupStatisticsCards();
    this.setupSummaryCards();
  }

  setupStatisticsCards() {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        const items = this.budgetData.filter(item => item.desc !== 'Total SGP');
        return items.map(item => {
          const percent = this.totalSGP > 0 ? (item.value / this.totalSGP) * 100 : 0;
          return {
            title: item.desc,
            cols: matches ? 4 : 1,
            rows: 1,
            value: item.value,
            formattedValue: this.formatCurrency(item.value),
            category: 'budget-item',
            color: this.getRandomColor(),
            percent: percent,
            icon: this.getCardIcon(item.desc)
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
            title: 'Total SGP Asignado',
            cols: cardSize,
            rows: 1,
            value: this.totalSGP,
            formattedValue: this.formatCurrency(this.totalSGP),
            category: 'summary',
            color: '#3F51B5', // Example color
            percent: 100,
            icon: 'account_balance_wallet'
          },
          {
            title: 'Recursos Distribuidos',
            cols: cardSize,
            rows: 1,
            value: this.distributedResources,
            formattedValue: this.formatCurrency(this.distributedResources),
            category: 'summary',
            color: '#009688', // Example color
            percent: this.distributionPercentage,
            icon: 'check_circle_outline'
          },
           // Add more summary cards if needed
        ];
      })
    ).subscribe(cards => {
      this.cardsSummarySubject.next(cards);
    });
  }

  getCardIcon(title: string): string {
    return this.categoryIcons[title] || this.categoryIcons['default'];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'Pesos',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getRandomColor(): string {
    const colors = ['#3F51B5', '#673AB7', '#009688', '#795548', '#FF5722', '#607D8B', '#E91E63'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  adjustBrightness(col: string, amt: number): string {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }
}
