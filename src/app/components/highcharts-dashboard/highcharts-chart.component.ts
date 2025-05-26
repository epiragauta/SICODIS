// src/app/components/highcharts-dashboard/highcharts-chart.component.ts
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
  @Input() options: Highcharts.Options = {}; // Changed from data and chartType

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}; // This will now be directly set by the input 'options'

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) { // Check if options is provided
      // Ensure that the provided options are not empty and are valid
      if (Object.keys(this.options).length > 0) {
        this.chartOptions = this.options;
      } else {
        // Provide a default minimal configuration if options are empty or invalid
        this.chartOptions = {
          title: { text: 'Chart is not configured' },
          series: [{
            type: 'line', // Default type
            data: []
          }]
        };
      }
    } else if (!this.options && changes['options']) {
      // Handle the case where options might be explicitly set to null or undefined
       this.chartOptions = {
          title: { text: 'Chart options were reset or not provided' },
          series: [{
            type: 'line',
            data: []
          }]
        };
    }
  }
}
