import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-highcharts-chart',
  templateUrl: './highcharts-chart.component.html',  
  styleUrls: ['./highcharts-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, HighchartsChartModule]
})
export class HighchartsChartComponent implements OnChanges {
  @Input() data: any;
  @Input() chartType: string = 'bar'; // Default chart type

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['chartType']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.data) {
      return;
    }

    if (this.chartType === 'pie') {
      this.chartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Pie Chart'
        },
        series: [{
          type: 'pie',
          data: this.data // Assuming data is in a format Highcharts pie chart expects
        }]
        // Add other pie chart specific options
      };
    } else if (this.chartType === 'bar') {
      this.chartOptions = {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Bar Chart'
        },
        xAxis: {
          // categories: this.data.categories // Assuming data structure
        },
        series: [{
          type: 'bar',
          data: this.data // Assuming data is in a format Highcharts bar chart expects
        }]
        // Add other bar chart specific options
      };
    }
    // Add more chart types if needed
  }
}
