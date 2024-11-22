import { Component, OnInit, Renderer2 } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports-sgr',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatGridListModule, MatCardModule, MatTableModule],
  templateUrl: './reports-sgr.component.html',
  styleUrl: './reports-sgr.component.scss'
})
export class ReportsSgrComponent implements OnInit {
  selected:string = '2024';
  infoResume:any = [
    {
      year: '2024',
      budget: '70540879911189',
      budgetDistributed: '70540879911189',
      pending: 0,
      percent: 1
    },
    {
      year: '2023',
      budget: '54936407931948',
      budgetDistributed: '54936407931948',
      pending: 0,
      percent: 1
    },
    {
      year: '2022',
      budget: '49564897462512',
      budgetDistributed: '49564897462512',
      pending: 0,
      percent: 1
    },
    {
      year: '2021',
      budget: '47675273699939',
      budgetDistributed: '47675273699939',
      pending: 0,
      percent: 1
    },
    {
      year: '2020',
      budget: '43847390906182',
      budgetDistributed: '43847390906182',
      pending: 0,
      percent: 1
    },
    {
      year: '2019',
      budget: '41257264108126',
      budgetDistributed: '41257264108126',
      pending: 0,
      percent: 1
    }
  ];
  dataSource:any = [
    {desc: 'Educación', value: 39685898906154},
    {desc: 'Salud', value: 16394199837551},
    {desc: 'Agua Potable', value: 3624435882562},
    {desc: 'Propósito General', value: 7785825229209},
    {desc: 'Alimentación Escolar', value: 349579078179},
    {desc: 'Ribereños', value: 55932652509},
    {desc: 'Resguardos Indígenas', value: 363562241306},
    {desc: 'Fonpet Asignaciones Especiales', value: 2281446083719},
    {desc: 'Total SGP', value: 70540879911189}
  ];
  departments:any = [
    {name: 'Amazonas'},
    {name: 'Bolivar'},
    {name: 'Boyacá'},
    {name: 'Casanare'},
    {name: 'Cesar'},
    {name: 'Cundinamarca'}
  ];
  towns:any=[
    {name: 'Municipio1'},
    {name: 'Municipio2'},
    {name: 'Municipio3'},
    {name: 'Municipio4'},
    {name: 'Municipio5'},
    {name: 'Municipio6'},
    {name: 'Municipio7'},
    {name: 'Municipio8'},
    {name: 'Municipio9'},
    {name: 'Municipio10'},
    {name: 'Municipio11'},
    {name: 'Municipio12'},

  ]
  displayedColumns: string[] = ['desc', 'value'];
  infoYear:any;
  infoToResume: any;
  departmentSelected: string = '';
  townSelected: string = '';

  constructor(private renderer: Renderer2){}

  ngOnInit(): void {
    this.infoToResume = this.infoResume.filter(
      (item:any) => item.year === this.selected
    )[0];
    this.createGraph();
  }

  optionChange(evt:any){
    this.infoToResume = this.infoResume.filter(
      (item:any) => item.year === evt.value
    )[0];
  }

  createGraph(){
    const ctx = this.renderer.selectRootElement('#gaugeChart') as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d');
    
    const gradient = ctx2d?.createLinearGradient(0, 0, ctx.width, 0);
    gradient?.addColorStop(0, 'rgba(53, 106, 212, 0.445)');
    gradient?.addColorStop(1, 'rgb(53, 106, 212)');

    const value = this.infoToResume.percent*100;
    const customPlugin={
      id: 'customPlugin',
      beforeDraw(chart:any) {
        const { width } = chart;
        const { height } = chart;
        const { ctx } = chart;

        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#3366CC';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${value}%`, width / 2, height / 1.3);
        ctx.restore();
      }
    };
    Chart.register(customPlugin);
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Valor Actual'],
        datasets: [{
          data: [value, 100-value],
          backgroundColor: [gradient, '#E0E0E0'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        rotation: -90,
        circumference: 180,
        cutout: '80%', 
        plugins: {
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
}
