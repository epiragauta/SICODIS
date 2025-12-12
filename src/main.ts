import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

 import { Chart } from 'chart.js';
 import ChartDataLabels from 'chartjs-plugin-datalabels';

 Chart.register(ChartDataLabels);


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
