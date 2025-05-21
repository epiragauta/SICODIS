import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartComponent } from './highcharts-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';

describe('HighchartsChartComponent', () => {
  let component: HighchartsChartComponent;
  let fixture: ComponentFixture<HighchartsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighchartsChartComponent, CommonModule, HighchartsChartModule] // Import standalone component
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighchartsChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateChart on ngOnChanges if data changes', () => {
    spyOn(component, 'updateChart');
    component.data = [{ name: 'Test', y: 10 }];
    component.ngOnChanges({
      data: { currentValue: component.data, previousValue: null, firstChange: true, isFirstChange: () => true }
    });
    expect(component.updateChart).toHaveBeenCalled();
  });

  it('should set pie chart options when chartType is "pie"', () => {
    component.chartType = 'pie';
    component.data = [{ name: 'Slice 1', y: 10 }];
    component.updateChart();
    expect(component.chartOptions.chart?.type).toBe('pie');
    expect(component.chartOptions.series?.[0]?.type).toBe('pie');
  });

  it('should set bar chart options when chartType is "bar"', () => {
    component.chartType = 'bar';
    component.data = [{ name: 'Bar 1', y: 20 }];
    component.updateChart();
    expect(component.chartOptions.chart?.type).toBe('bar');
    expect(component.chartOptions.series?.[0]?.type).toBe('bar');
  });
});
