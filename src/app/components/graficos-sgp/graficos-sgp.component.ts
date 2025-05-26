// src/app/components/graficos-sgp/graficos-sgp.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';
import { HighchartsChartComponent } from '../highcharts-dashboard/highcharts-chart.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts'; // Ensure Highcharts is imported

@Component({
  selector: 'app-graficos-sgp',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    HighchartsChartModule,
    HighchartsChartComponent
  ],
  templateUrl: './graficos-sgp.component.html',
  styleUrls: ['./graficos-sgp.component.scss']
})
export class GraficosSgpComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  cols$: Observable<number> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches ? 1 : 2)
    );

  chartOptions1!: Highcharts.Options; 
  chartOptions2!: Highcharts.Options;
  chartOptions3!: Highcharts.Options;
  chartOptions4!: Highcharts.Options;
  chartOptions5_1!: Highcharts.Options;
  chartOptions5_2!: Highcharts.Options;
  chartOptions6_1!: Highcharts.Options;
  chartOptions6_2!: Highcharts.Options;
  chartOptions7_1!: Highcharts.Options;
  chartOptions7_2!: Highcharts.Options;
  chartOptions8_1!: Highcharts.Options;
  chartOptions8_2!: Highcharts.Options;
  
  constructor() {
    this.initializeChartData(); 
  }

  ngOnInit(): void {
    // Data initialization is called in constructor
  }

  private generateEvolucionSGPData(): { years: string[], copValues: number[], variations: (number | null)[] } {
    const years = Array.from({ length: 2025 - 2005 + 1 }, (_, i) => (2005 + i).toString());
    const copValues: number[] = [];
    const startValue = 15_000_000_000;
    const endValue = 82_000_000_000;
    const numYears = years.length;

    copValues[0] = startValue;
    copValues[numYears - 1] = endValue;
    let currentValue = startValue;
    for (let i = 1; i < numYears - 1; i++) {
      const remainingYearsToDistribute = numYears - 1 - i;
      const remainingValueToDistribute = endValue - currentValue;
      const maxPossibleIncrementInYear = remainingValueToDistribute / (remainingYearsToDistribute +1) ; 
      const randomFactor = (Math.random() * 0.4) + 0.8; 
      let increment = Math.max(1_000_000_000, maxPossibleIncrementInYear * randomFactor); 
      
      if (currentValue + increment * (remainingYearsToDistribute + 0.5) > endValue ) {
          increment = (endValue - currentValue) / (remainingYearsToDistribute + Math.random() + 0.1);
      }
      increment = Math.max(1_000_000_000, increment); 

      currentValue += increment;
      copValues[i] = Math.floor(currentValue);
    }
    for (let i = 1; i < numYears -1; i++) {
        copValues[i] = Math.max(copValues[i-1] + 1_000_000_000, copValues[i]); 
        copValues[i] = Math.min(copValues[i], endValue - ( (numYears -1 - i) * 1_000_000_000) ); 
    }
    for (let i = 1; i < numYears - 1; i++) {
        if (copValues[i] >= endValue) {
            copValues[i] = copValues[i-1] + Math.abs(endValue - copValues[i-1]) * Math.random() *0.5 + 1_000_000_000 ;
        }
    }
    copValues[numYears - 1] = endValue;
     for (let i = 0; i < numYears - 1; i++) {
        if (copValues[i+1] < copValues[i]) {
             copValues[i+1] = copValues[i] + 1_000_000_000; 
        }
    }
    copValues[numYears - 1] = Math.max(endValue, copValues[numYears-2]+1_000_000_000);

    const variations: (number | null)[] = [null];
    for (let i = 1; i < numYears; i++) {
      if (copValues[i-1] === 0) { 
        variations.push(copValues[i] > 0 ? 100.00 : 0); 
      } else {
        const variation = ((copValues[i] - copValues[i-1]) / copValues[i-1]) * 100;
        variations.push(parseFloat(variation.toFixed(2)));
      }
    }
    return { years, copValues, variations };
  }

  private generateSGPParticipacionesData(totalCopValues: number[], years: string[]): { seriesData: Highcharts.SeriesOptionsType[] } {
    const participaciones = ['Educación', 'Salud', 'Agua potable', 'Propósito general', 'Asignaciones especiales'];
    const basePercentages = [0.45, 0.25, 0.10, 0.15, 0.05]; 
    const numYears = years.length;

    const correctedSeriesData: Highcharts.SeriesOptionsType[] = participaciones.map(name => ({
        type: 'column',
        name: name,
        data: new Array(numYears).fill(0)
    }));

    for (let j = 0; j < numYears; j++) {
        let yearTotal = totalCopValues[j];
        let sumForYear = 0;
        for (let i = 0; i < participaciones.length - 1; i++) {
            let currentBasePercentage = basePercentages[i] !== undefined ? basePercentages[i] : 0.1;
            const randomFactor = (Math.random() - 0.5) * 0.05 + currentBasePercentage; 
            const val = Math.floor(yearTotal * Math.max(0.01, randomFactor));
            (correctedSeriesData[i].data as number[])[j] = val;
            sumForYear += val;
        }
        (correctedSeriesData[participaciones.length - 1].data as number[])[j] = Math.max(0, yearTotal - sumForYear);
    }
    return { seriesData: correctedSeriesData };
  }

  private generateEvolucionSGPConstantesData(): { years: string[], copValues: number[], variations: (number | null)[] } {
    const years = Array.from({ length: 2025 - 2005 + 1 }, (_, i) => (2005 + i).toString());
    const copValues: number[] = [];
    const startValue = 12_000_000_000;
    const endValue = 70_000_000_000;
    const numYears = years.length;
  
    copValues[0] = startValue;
    copValues[numYears - 1] = endValue;
  
    let currentValue = startValue;
    for (let i = 1; i < numYears - 1; i++) {
      const remainingYearsToDistribute = numYears - 1 - i;
      const remainingValueToDistribute = endValue - currentValue;
      const divisor = remainingYearsToDistribute + 1;
      const maxPossibleIncrementInYear = divisor > 0 ? remainingValueToDistribute / divisor : remainingValueToDistribute;
      
      const randomFactor = (Math.random() * 0.4) + 0.8; 
      let increment = Math.max(500_000_000, maxPossibleIncrementInYear * randomFactor); 
      
      const randomDivisor = remainingYearsToDistribute + Math.random();
      if (currentValue + increment * (remainingYearsToDistribute + 0.5) > endValue ) {
          increment = randomDivisor > 0 ? (endValue - currentValue) / randomDivisor : (endValue - currentValue);
      }
      increment = Math.max(500_000_000, increment); 
  
      currentValue += increment;
      copValues[i] = Math.floor(currentValue);
    }
    
    for (let i = 1; i < numYears -1; i++) {
        copValues[i] = Math.max(copValues[i-1] + 500_000_000, copValues[i]); 
        copValues[i] = Math.min(copValues[i], endValue - ( (numYears -1 - i) * 500_000_000) ); 
    }
    for (let i = 1; i < numYears - 1; i++) {
        if (copValues[i] >= endValue - ((numYears - 1 - i -1) * 500_000_000) ) { 
            copValues[i] = copValues[i-1] + Math.abs(endValue - copValues[i-1]) * Math.random() *0.3 + 500_000_000 ;
            copValues[i] = Math.min(copValues[i], endValue - ((numYears -1 -i) * 500_000_000)); 
        }
    }
    copValues[numYears - 1] = endValue; 
     for (let i = 0; i < numYears - 1; i++) { 
        if (copValues[i+1] <= copValues[i]) {
             copValues[i+1] = copValues[i] + 500_000_000; 
        }
    }
    copValues[numYears - 1] = Math.max(endValue, copValues[numYears-2]+500_000_000);

    const variations: (number | null)[] = [null];
    for (let i = 1; i < numYears; i++) {
      if (copValues[i-1] === 0) {
        variations.push(copValues[i] > 0 ? 100.00 : 0);
      } else {
        const variation = ((copValues[i] - copValues[i-1]) / copValues[i-1]) * 100;
        variations.push(parseFloat(variation.toFixed(2)));
      }
    }
    return { years, copValues, variations };
  }

  private extractSingleParticipationData(
    sgpTotalDataFunction: () => { years: string[], copValues: number[], variations: (number | null)[] },
    participationName: string, 
    targetYearsArray: string[],
    participationBasePercentage: number 
  ): { years: string[], values: number[], variations: (number | null)[] } {
    const fullSgpData = sgpTotalDataFunction(); 
    const relevantYearsData: { year: string, value: number }[] = [];
  
    for (const year of targetYearsArray) {
      const yearIndex = fullSgpData.years.indexOf(year);
      if (yearIndex > -1) {
        const totalForYear = fullSgpData.copValues[yearIndex];
        const randomFactor = (Math.random() - 0.5) * 0.05; 
        const effectivePercentage = participationBasePercentage + randomFactor;
        const participationValue = Math.floor(totalForYear * Math.max(0.01, effectivePercentage));
        relevantYearsData.push({ year: year, value: participationValue });
      }
    }
  
    const years = relevantYearsData.map(d => d.year);
    const values = relevantYearsData.map(d => d.value);
    const variations: (number | null)[] = [null]; 
    for (let i = 1; i < values.length; i++) {
      if (values[i-1] === 0) { 
        variations.push(values[i] > 0 ? 100.00 : 0);
      } else {
        const variation = ((values[i] - values[i-1]) / values[i-1]) * 100;
        variations.push(parseFloat(variation.toFixed(2)));
      }
    }
    return { years, values, variations };
  }

  initializeChartData() {
    // Chart 1 init
    const data1 = this.generateEvolucionSGPData();
    this.chartOptions1 = {
      chart: { zoomType: 'xy' },
      title: { text: 'Evolución SGP – Precios Corrientes', align: 'left' },
      xAxis: [{ categories: data1.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        { 
          labels: { format: '{value:,.0f} COP', style: { color: 'orange' } }, 
          title: { text: 'Monto (COP)', style: { color: 'orange' } }
        },
        { 
          title: { text: 'Variación Anual (%)', style: { color: 'blue' } },
          labels: { format: '{value} %', style: { color: 'blue' } },
          opposite: true
        }
      ],
      tooltip: { shared: true },
      legend: { enabled: true },
      series: [
        {
          name: 'Monto SGP (Precios Corrientes)',
          type: 'column',
          yAxis: 0, 
          data: data1.copValues,
          color: 'orange', 
          tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
        },
        {
          name: 'Variación Anual',
          type: 'line',
          yAxis: 1, 
          data: data1.variations,
          color: 'blue', 
          tooltip: { valueSuffix: ' %', valueDecimals: 2 }
        }
      ]
    };

    // Chart 2 init
    const participacionesData = this.generateSGPParticipacionesData(data1.copValues, data1.years);
    this.chartOptions2 = {
      chart: { type: 'column' },
      title: { text: 'Evolución SGP Por Participaciones– Precios Corrientes', align: 'left' },
      xAxis: [{ categories: data1.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        { 
          title: { text: 'Monto (COP)' }, 
          labels: { format: '{value:,.0f}' },
          stackLabels: { 
            enabled: true, 
            format: '{total:,.0f}', 
            style: { fontWeight: 'bold', color: (Highcharts.defaultOptions.title?.style?.color) || 'gray' } 
          }
        },
        { 
          title: { text: 'Variación Anual (%)', style: { color: 'orange' } },
          labels: { format: '{value} %', style: { color: 'orange' } },
          opposite: true
        }
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          let points = this.points!;
          let s = '<b>' + this.x + '</b>';
          let stackTotal = 0;
          points.forEach((point) => {
            if (point.series.type === 'column' && point.y !== null && point.y !== undefined) { 
               stackTotal += point.y;
            }
          });
          points.forEach((point) => {
            s += '<br/><span style="color:' + point.series.color + '">●</span> ' + point.series.name + ': ';
            if (point.y === null || point.y === undefined) { 
                 s += 'N/A';
            } else if (point.series.type === 'line') {
              s += Highcharts.numberFormat(point.y, 2) + ' %';
            } else {
              s += Highcharts.numberFormat(point.y, 0) + ' COP';
            }
          });
          if (points.some(p => p.series.type === 'column')) {
            s += '<br/>Total: ' + Highcharts.numberFormat(stackTotal, 0) + ' COP';
          }
          return s;
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          colors: ['#28a745', '#218838', '#1e7e34', '#1a6f2c', '#155f23'], 
        }
      },
      legend: { enabled: true },
      series: [
        ...participacionesData.seriesData,
        {
          name: 'Variación Anual',
          type: 'line',
          yAxis: 1, 
          data: data1.variations,
          color: 'orange',
          marker: { lineWidth: 2, lineColor: 'orange', fillColor: 'white' },
          tooltip: { valueSuffix: ' %' } 
        }
      ]
    };

    // Chart 3 init
    const data3 = this.generateEvolucionSGPConstantesData();
    this.chartOptions3 = {
      chart: { zoomType: 'xy' },
      title: { text: 'Evolución SGP – Precios Constantes', align: 'left' },
      xAxis: [{ categories: data3.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        { 
          labels: { format: '{value:,.0f} COP', style: { color: 'blue' } }, 
          title: { text: 'Monto (COP Precios Constantes)', style: { color: 'blue' } }
        },
        { 
          title: { text: 'Variación Anual (%)', style: { color: 'fuchsia' } },
          labels: { format: '{value} %', style: { color: 'fuchsia' } }, 
          opposite: true
        }
      ],
      tooltip: { shared: true },
      legend: { enabled: true },
      series: [
        {
          name: 'Monto SGP (Precios Constantes)',
          type: 'column',
          yAxis: 0,
          data: data3.copValues,
          color: 'blue',
          tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
        },
        {
          name: 'Variación Anual (Precios Constantes)',
          type: 'line',
          yAxis: 1,
          data: data3.variations,
          color: 'fuchsia',
          tooltip: { valueSuffix: ' %', valueDecimals: 2 }
        }
      ]
    };

    // Chart 4 init
    const dataConstantes = data3; 
    const participacionesDataConstantes = this.generateSGPParticipacionesData(dataConstantes.copValues, dataConstantes.years);

    this.chartOptions4 = {
      chart: { type: 'column' },
      title: { text: 'Evolución SGP por Participaciones – Precios Constantes', align: 'left' },
      xAxis: [{ categories: dataConstantes.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        { 
          title: { text: 'Monto (COP Precios Constantes)' },
          labels: { format: '{value:,.0f}' },
          stackLabels: { 
            enabled: true, 
            format: '{total:,.0f}',
            style: { fontWeight: 'bold', color: (Highcharts.defaultOptions.title?.style?.color) || 'gray' } 
          }
        },
        { 
          title: { text: 'Variación Anual (%)', style: { color: 'teal' } },
          labels: { format: '{value} %', style: { color: 'teal' } }, 
          opposite: true
        }
      ],
      tooltip: { 
        shared: true,
        formatter: function () {
          let points = this.points!;
          let s = '<b>' + this.x + '</b>';
          let stackTotal = 0;
          points.forEach((point) => {
            if (point.series.type === 'column' && point.y !== null && point.y !== undefined) { 
               stackTotal += point.y;
            }
          });
          points.forEach((point) => {
            s += '<br/><span style="color:' + point.series.color + '">●</span> ' + point.series.name + ': ';
            if (point.y === null || point.y === undefined) { 
                s += 'N/A';
            } else if (point.series.type === 'line') {
              s += Highcharts.numberFormat(point.y, 2) + ' %';
            } else {
              s += Highcharts.numberFormat(point.y, 0) + ' COP';
            }
          });
          if (points.some(p => p.series.type === 'column')) {
            s += '<br/>Total: ' + Highcharts.numberFormat(stackTotal, 0) + ' COP';
          }
          return s;
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          colors: ['#007bff', '#0069d9', '#005cbf', '#004c9e', '#003d7d'] 
        }
      },
      legend: { enabled: true },
      series: [
        ...participacionesDataConstantes.seriesData,
        {
          name: 'Variación Anual (Precios Constantes)',
          type: 'line',
          yAxis: 1,
          data: dataConstantes.variations,
          color: 'teal',
          marker: { lineWidth: 2, lineColor: 'teal', fillColor: 'white' },
          tooltip: { valueSuffix: ' %' }
        }
      ]
    };

    // Chart 5.1: Evolución Educación SGP (Precios Corrientes 2015-2024)
    const educacionYears = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString());
    const educacionDataCorrientes = this.extractSingleParticipationData(
      this.generateEvolucionSGPData.bind(this), 
      'Educación', 
      educacionYears,
      0.45 
    );

    this.chartOptions5_1 = {
      chart: { zoomType: 'xy' },
      title: { text: 'Educación SGP (Precios Corrientes 2015-2024)', align: 'left', style: { fontSize: '14px' } },
      xAxis: [{ categories: educacionDataCorrientes.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        {
          labels: { format: '{value:,.0f}', style: { color: 'orange' } },
          title: { text: 'Monto Educación (COP)', style: { color: 'orange' } }
        },
        {
          title: { text: 'Variación Anual (%)', style: { color: 'blue' } },
          labels: { format: '{value} %', style: { color: 'blue' } },
          opposite: true
        }
      ],
      tooltip: { shared: true },
      legend: { enabled: true, align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
      series: [
        {
          name: 'Monto Educación (Corrientes)',
          type: 'column',
          yAxis: 0,
          data: educacionDataCorrientes.values,
          color: 'orange',
          tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
        },
        {
          name: 'Variación Anual',
          type: 'line',
          yAxis: 1,
          data: educacionDataCorrientes.variations,
          color: 'blue',
          tooltip: { valueSuffix: ' %', valueDecimals: 2 }
        }
      ]
    };

    // Chart 5.2: Educación SGP (Precios Constantes - 2025)
    const educacionDataConstantes2025 = this.extractSingleParticipationData(
      this.generateEvolucionSGPConstantesData.bind(this), 
      'Educación',
      ['2025'],
      0.45 
    );

    this.chartOptions5_2 = {
      chart: { type: 'column' },
      title: { text: 'Educación SGP (Precios Constantes 2025)', align: 'left', style: { fontSize: '14px' } },
      xAxis: [{ categories: educacionDataConstantes2025.years, title: { text: 'Año' } }],
      yAxis: [{ title: { text: 'Monto Educación (COP Constantes)' }, labels: {format: '{value:,.0f}'} }],
      series: [{
        name: 'Monto Educación (Constantes 2025)',
        type: 'column', 
        data: educacionDataConstantes2025.values, 
        color: '#2a9d8f', 
        tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
      }],
      legend: { enabled: false } 
    };

    // Chart 6.1: Evolución Agua Potable SGP (Precios Corrientes 2015-2024)
    const aguaPotableYears = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString());
    const aguaPotableDataCorrientes = this.extractSingleParticipationData(
      this.generateEvolucionSGPData.bind(this),
      'Agua potable', 
      aguaPotableYears,
      0.10 // Base percentage for Agua potable
    );

    this.chartOptions6_1 = {
      chart: { zoomType: 'xy' },
      title: { text: 'Agua Potable SGP (Precios Corrientes 2015-2024)', align: 'left', style: { fontSize: '14px' } },
      xAxis: [{ categories: aguaPotableDataCorrientes.years, crosshair: true, title: { text: 'Año' } }],
      yAxis: [
        {
          labels: { format: '{value:,.0f}', style: { color: 'orange' } },
          title: { text: 'Monto Agua Potable (COP)', style: { color: 'orange' } }
        },
        {
          title: { text: 'Variación Anual (%)', style: { color: 'blue' } },
          labels: { format: '{value} %', style: { color: 'blue' } },
          opposite: true
        }
      ],
      tooltip: { shared: true },
      legend: { enabled: true, align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
      series: [
        {
          name: 'Monto Agua Potable (Corrientes)',
          type: 'column',
          yAxis: 0,
          data: aguaPotableDataCorrientes.values,
          color: 'orange',
          tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
        },
        {
          name: 'Variación Anual',
          type: 'line',
          yAxis: 1,
          data: aguaPotableDataCorrientes.variations,
          color: 'blue',
          tooltip: { valueSuffix: ' %', valueDecimals: 2 }
        }
      ]
    };

    // Chart 6.2: Agua Potable SGP (Precios Constantes - 2025)
    const aguaPotableDataConstantes2025 = this.extractSingleParticipationData(
      this.generateEvolucionSGPConstantesData.bind(this),
      'Agua potable',
      ['2025'],
      0.10 // Base percentage for Agua potable
    );

    this.chartOptions6_2 = {
      chart: { type: 'column' },
      title: { text: 'Agua Potable SGP (Precios Constantes 2025)', align: 'left', style: { fontSize: '14px' } },
      xAxis: [{ categories: aguaPotableDataConstantes2025.years, title: { text: 'Año' } }],
      yAxis: [{ title: { text: 'Monto Agua Potable (COP Constantes)' }, labels: {format: '{value:,.0f}'} }],
      series: [{
        name: 'Monto Agua Potable (Constantes 2025)',
        type: 'column',
        data: aguaPotableDataConstantes2025.values,
        color: '#219ebc', // New shade for this chart
        tooltip: { valueSuffix: ' COP', valueDecimals: 0 }
      }],
      legend: { enabled: false }
    };

    // Initialize other chartOptions as placeholders
    this.chartOptions7_1 = { title: { text: 'Chart 7.1 Placeholder' }, series: [{type: 'line', data: []}] };
    this.chartOptions7_2 = { title: { text: 'Chart 7.2 Placeholder' }, series: [{type: 'line', data: []}] };
    this.chartOptions8_1 = { title: { text: 'Chart 8.1 Placeholder' }, series: [{type: 'line', data: []}] };
    this.chartOptions8_2 = { title: { text: 'Chart 8.2 Placeholder' }, series: [{type: 'line', data: []}] };
  }

  getColspan(isPairRow: boolean): Observable<number> {
    return this.cols$.pipe(
      map(cols => {
        if (cols === 1) {
          return 1; 
        } else {
          return 2; 
        }
      })
    );
  }
}
