import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
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
        '(min-width: 1320px)': false
      }
    }));

    await TestBed.configureTestingModule({
      imports: [
        PresupuestoYRecaudoComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
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

  it('should initialize financial data in zero until the API answers', () => {
    // `loadFinancialData()` quedó desactivado en `ngOnInit`: los valores llegan
    // de la API, así que el estado inicial es la estructura en ceros.
    expect(component.financialData).toBeDefined();
    expect(component.financialData.presupuesto_total_vigente).toBe(0);
    expect(component.financialData.caja_total).toBe(0);
  });

  // `formatCurrency` pasó a ser privado y `formatToBillions` desapareció; en su
  // lugar se comprueban los formateadores públicos que usa la plantilla.
  it('should format numbers with the Colombian locale', () => {
    expect(component.formatNumber(1234567)).toBe((1234567).toLocaleString('es-CO'));
  });

  it('should format percentages with two decimals', () => {
    expect(component.formatPercentage(0.1234)).toBe('12.34%');
    expect(component.formatPercentage('0.5')).toBe('50.00%');
    expect(component.formatPercentage(null)).toBe('');
    expect(component.formatPercentage(undefined)).toBe('');
  });

  // La barra horizontal de tres barras se sustituyó por las donas que arma
  // `initializeCharts()`, que se pueblan cuando llegan los datos de la API.
  it('should declare the chart bindings used by the template', () => {
    expect('chartData' in component).toBe(true);
    expect('chartOptions' in component).toBe(true);
  });

  it('should initialize the table columns', () => {
    // `treeTableCols` quedó sin uso; la tabla se arma con `cols` (= colsA).
    expect(component.cols).toEqual(component.colsA);
    expect(component.cols.length).toBe(8);
    expect(component.cols[0].field).toBe('concepto');
    expect(component.cols[0].header).toBe('Concepto');
  });

  it('should initialize the expandable columns', () => {
    expect(component.expandedCols.length).toBe(6);
    expect(component.expandedCols.map(c => c.field)).toContain('rendimientos_financieros');
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

  it('should default the territorial filters to "all"', () => {
    // La vigencia ya no se fija en código: la elige `cargarVigencias()` con lo
    // que devuelva la API. Lo que sí es determinista son los filtros.
    expect(component.departmentSelected).toBe('0');
    expect(component.townSelected).toBe('0');
    expect(component.towns).toEqual([{ id: '0', label: 'Todos' }]);
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