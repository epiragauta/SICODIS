import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

import { PresupuestoYRecaudoComponent } from './presupuesto-y-recaudo.component';

describe('PresupuestoYRecaudoComponent', () => {
  let component: PresupuestoYRecaudoComponent;
  let fixture: ComponentFixture<PresupuestoYRecaudoComponent>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    // Mock del BreakpointObserver
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockBreakpointObserver.observe.and.returnValue(of({
      matches: true,
      breakpoints: {
        '(max-width: 599.98px)': false,
        '(min-width: 600px) and (max-width: 959.98px)': false,
        '(min-width: 960px) and (max-width: 1279.98px)': true,
        '(min-width: 1280px)': false
      }
    }));

    await TestBed.configureTestingModule({
      imports: [
        PresupuestoYRecaudoComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoYRecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize financial data', () => {
    expect(component.financialData).toBeDefined();
    expect(component.financialData.presupuesto_total_vigente).toBeGreaterThan(0);
    expect(component.financialData.caja_total).toBeGreaterThan(0);
  });

  it('should format currency to billions correctly', () => {
    const testValue = 1000000000000; // 1 billón
    const result = component.formatCurrency(testValue);
    expect(result).toBe('1.00 B');
  });

  it('should convert to billions correctly', () => {
    const testValue = 63697733611855.4;
    const result = component.formatToBillions(testValue);
    expect(result).toBeCloseTo(63.7, 1);
  });

  it('should initialize chart data with correct structure for 3 bars', () => {
    expect(component.chartData).toBeDefined();
    expect(component.chartData.labels).toEqual(['Total', 'Corriente', 'Otros']);
    expect(component.chartData.datasets).toHaveSize(2);
    expect(component.chartData.datasets[0].label).toBe('Presupuesto');
    expect(component.chartData.datasets[1].label).toBe('Caja/Recaudo');
    expect(component.chartData.datasets[0].data).toHaveSize(3);
    expect(component.chartData.datasets[1].data).toHaveSize(3);
  });

  it('should initialize chart options for non-stacked horizontal bar chart', () => {
    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions.indexAxis).toBe('y');
    expect(component.chartOptions.responsive).toBe(true);
    expect(component.chartOptions.scales.x.stacked).toBe(false);
    expect(component.chartOptions.scales.y.stacked).toBe(false);
  });

  it('should initialize tree table columns', () => {
    expect(component.treeTableCols).toHaveSize(5);
    expect(component.treeTableCols[0].field).toBe('concepto');
    expect(component.treeTableCols[0].header).toBe('Concepto');
  });

  it('should initialize menu items for export', () => {
    expect(component.menuItems).toHaveSize(2);
    expect(component.menuItems[0].label).toBe('Exportar Excel');
    expect(component.menuItems[1].label).toBe('Exportar PDF');
  });

  it('should call exportData with correct format', () => {
    spyOn(console, 'log');
    component.exportData('excel');
    expect(console.log).toHaveBeenCalledWith('Exportando datos en formato: excel');
  });

  it('should call queryData', () => {
    spyOn(console, 'log');
    component.queryData();
    expect(console.log).toHaveBeenCalledWith('Consultando datos...');
  });

  it('should have default selected vigencia', () => {
    expect(component.selectedVigencia).toEqual({ id: 1, label: 'Vigencia Bienio 2025 - 2026' });
  });

  it('should have fixed card columns layout', () => {
    expect(component.cardCols).toBe(2);
  });

  it('should respond to breakpoint changes for main grid only', () => {
    expect(mockBreakpointObserver.observe).toHaveBeenCalled();
    expect(component.cols).toBeDefined();
    // cardCols should always be 2
    expect(component.cardCols).toBe(2);
  });
});