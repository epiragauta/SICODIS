import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsDashboardComponent } from './highcharts-dashboard.component';
import { BudgetServiceStatic } from '../dashboard/budget.service'; // Adjusted path
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// Import HighchartsChartComponent if it's directly used in the template and needs to be tested as part of this component.
// For shallow tests, you might provide a mock.
// import { HighchartsChartComponent } from './highcharts-chart.component';


// Mock BudgetServiceStatic
class MockBudgetService {
  getBudgetData() {
    return of([
      { desc: 'Educación', value: 1000, detail: [] },
      { desc: 'Salud', value: 500, detail: [] },
      { desc: 'Total SGP', value: 1500, detail: [] }
    ]);
  }
  calculateTotalSGP(items: any[]): number {
    const totalItem = items.find(item => item.desc === 'Total SGP');
    return totalItem ? totalItem.value : 0;
  }
}

// Mock BreakpointObserver
class MockBreakpointObserver {
  observe(value: string | readonly string[]) {
    return of({ matches: false, breakpoints: {} }); // Simulate desktop view by default
  }
}

describe('HighchartsDashboardComponent', () => {
  let component: HighchartsDashboardComponent;
  let fixture: ComponentFixture<HighchartsDashboardComponent>;
  let budgetService: BudgetServiceStatic;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HighchartsDashboardComponent, // Standalone component
        NoopAnimationsModule, // For Material components
        MatGridListModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        // HighchartsChartComponent // Import if needed, or provide a mock schema (HighchartsChartComponent is already standalone and imported by HighchartsDashboardComponent)
      ],
      providers: [
        { provide: BudgetServiceStatic, useClass: MockBudgetService },
        { provide: BreakpointObserver, useClass: MockBreakpointObserver }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighchartsDashboardComponent);
    component = fixture.componentInstance;
    budgetService = TestBed.inject(BudgetServiceStatic);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load budget data on init and prepare main chart data', () => {
    spyOn(budgetService, 'getBudgetData').and.callThrough();
    spyOn(component, 'prepareMainChartData').and.callThrough();
    fixture.detectChanges(); // Calls ngOnInit
    expect(budgetService.getBudgetData).toHaveBeenCalled();
    expect(component.budgetData.length).toBeGreaterThan(0);
    expect(component.totalSGP).toBe(1500);
    expect(component.prepareMainChartData).toHaveBeenCalled();
  });
  
  it('should prepare mainChartData correctly for bar chart', () => {
    component.mainChartType = 'bar';
    component.budgetData = [ // Manually set budgetData for this test
      { desc: 'Educación', value: 1000, detail: [] },
      { desc: 'Salud', value: 500, detail: [] },
      { desc: 'Total SGP', value: 1500, detail: [] }
    ];
    component.prepareMainChartData();
    expect(component.mainChartData.length).toBe(2); // Excludes 'Total SGP'
    expect(component.mainChartData[0].name).toBe('Educación');
    expect(component.mainChartData[0].y).toBe(1000 / 1000000000);
  });

  it('should setup statistics cards', (done) => {
    fixture.detectChanges(); // ngOnInit -> loadBudgetData -> setupCards
    component.cardsStatistics.subscribe(cards => {
      expect(cards.length).toBe(2); // Educación and Salud
      expect(cards[0].title).toBe('Educación');
      done();
    });
  });

  it('should setup summary cards', (done) => {
    fixture.detectChanges(); // ngOnInit -> loadBudgetData -> setupCards
    component.cardsSummary.subscribe(cards => {
      expect(cards.length).toBeGreaterThan(0); // Should have at least 'Total SGP Asignado' and 'Recursos Distribuidos'
      expect(cards.find(c => c.title === 'Total SGP Asignado')).toBeTruthy();
      done();
    });
  });
});
