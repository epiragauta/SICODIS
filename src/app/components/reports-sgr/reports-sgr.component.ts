import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  LOCALE_ID,
  ElementRef
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, isPlatformBrowser, formatCurrency } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Chart from 'chart.js/auto';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { ReportsMapComponent } from '../reports-map/reports-map.component';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { ReportsSgrStatsComponent } from './reports-sgr-stats.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-reports-sgr',
    standalone: true,
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatGridListModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        ReportsMapComponent,
        MatIconModule,
        MatTooltipModule,
        TableModule,
        ButtonModule,
        Dialog,
        TabsModule,
        IconFieldModule,
        InputTextModule,
        InputIconModule,
        MultiSelectModule,
        SelectModule,
        ChartModule,
        DividerModule,
        ReportsSgrStatsComponent,
        NumberFormatPipe,
        Breadcrumb
    ],
    templateUrl: './reports-sgr.component.html',
    styleUrl: './reports-sgr.component.scss'
})
export class ReportsSgrComponent implements AfterViewInit, OnInit {

  dataSourceTable = new MatTableDataSource<TableElement>();
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild('chartContainer') chartContainer: any;
  @ViewChild('chartCanva') chartCanva: any;
  @ViewChild('mainTable') mainTable: any;
  @ViewChild('mapContainer') mapContainer: any;
  @ViewChild('panel2Tab') panel2Tab: any;
  @ViewChild('panel1Tab') panel1Tab: any;
  public chart: any;
  selected: string = '2024';
  infoResume: any = [
    {
      year: '2024',
      budget: '70540879911189',
      budgetDistributed: '70540879911189',
      pending: 0,
      percent: 1,
    },
    {
      year: '2023',
      budget: '54936407931948',
      budgetDistributed: '54936407931948',
      pending: 0,
      percent: 1,
    },
    {
      year: '2022',
      budget: '49564897462512',
      budgetDistributed: '49564897462512',
      pending: 0,
      percent: 1,
    },
    {
      year: '2021',
      budget: '47675273699939',
      budgetDistributed: '47675273699939',
      pending: 0,
      percent: 1,
    },
    {
      year: '2020',
      budget: '43847390906182',
      budgetDistributed: '43847390906182',
      pending: 0,
      percent: 1,
    },
    {
      year: '2019',
      budget: '41257264108126',
      budgetDistributed: '41257264108126',
      pending: 0,
      percent: 1,
    },
  ];
  dataSource: any = [
    { desc: 'Educación', value: 39685898906154 },
    { desc: 'Salud', value: 16394199837551 },
    { desc: 'Agua Potable', value: 3624435882562 },
    { desc: 'Propósito General', value: 7785825229209 },
    { desc: 'Alimentación Escolar', value: 349579078179 },
    { desc: 'Ribereños', value: 55932652509 },
    { desc: 'Resguardos Indígenas', value: 363562241306 },
    { desc: 'Fonpet Asignaciones Especiales', value: 2281446083719 },
    { desc: 'Total SGP', value: 70540879911189 },
  ];
  departments: any = [
    { name: 'Todos' },
    { name: 'Amazonas' },
    { name: 'Bolivar' },
    { name: 'Boyacá' },
    { name: 'Casanare' },
    { name: 'Cesar' },
    { name: 'Cundinamarca' },
    { name: 'Otros' },
  ];
  towns: any = [
    { 'c': '01', d: 'Municipio1' },
    { 'c': '02', d: 'Municipio2' },
  ];
  attrs: any = [
    { "codigo": "aa", "nombre": "Asignación"}
  ];

  lawPeriods = [
    { name: '2023-2032 - Ley 2279 de 2022' },
    { name: '2021-2030 - Ley 2072 de 2020' },
    { name: '2019-2028 - Ley 1942 de 2018' },
    { name: '2017-2026 - Decreto 2190 de 2016' },
    { name: '2015-2024 - Ley 1744 de 2014' },
    { name: '2013-2022 - Ley 1606 de 2012' },
  ];

  displayedColumns: string[] = ['desc', 'value'];
  displayedColumns2: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];
  infoYear: any;
  infoToResume: any;
  departmentSelected: string = '';
  townSelected: string = '';
  lawPeriodSelected: string = '';
  attrSelected: string[] = [];
  rowIsClicked: boolean = false;
  showChart: boolean = false;

  lbls = [
    { label: 'INVERSION' },
    { label: 'Asignación para la Paz' },
    { label: 'Asignaciones Directas', detail: [
      { label: '20% Asignaciones Directas'},
      { label: '5% Asignaciones Directas Anticipadas' }
    ]},
    { label: 'Asignación para la Inversión Regional', detail: [
      { label: 'Departamentos' },
      { label: 'Regiones' },
    ] },
    { label: 'Asignación para la Inversión Local', detail: [
      { label: 'Municipios más pobres' },
      { label: 'Destinación para medio ambiente y desarrollo sostenible' },
      { label: 'Resto de Inversión' },
      { label: 'Comunidades Étnicas' },
      { label: 'Comunidades Indígenas' },
      { label: 'Destinación para medio ambiente y desarrollo sostenible' },
      { label: 'Resto de Inversión' },
      { label: 'Comunidades NARP' },
      { label: 'Destinación para medio ambiente y desarrollo sostenible' },
      { label: 'Resto de Inversión' },
      { label: 'Comunidades Rrom' },
      { label: 'Destinación para medio ambiente y desarrollo sostenible' },
      { label: 'Resto de Inversión' },
    ] },
    { label: 'Asignación para Ciencia, Tecnología e Innovación', detail: [
      {
        label:
          'Asignación para Inversión en Ciencia, Tecnología e Innovación Ambiental',
      },
      { label: 'Resto de inversión' },
    ] },
    { label: 'Asignación Ambiental' },
    { label: 'Municipios Río Magdalena y Canal Dique' },
    { label: 'AHORRO' },
    { label: 'Fondo de Ahorro y Estabilización (Ahorro)' },
    { label: 'Fondo Ahorro Pensional Territorial(FONPET)' },
    { label: 'OTROS' },
    { label: 'Funcionamiento, operatividad y fiscalización' },
    { label: 'Sistema de Seguimiento, Control y Evaluación (SSEC)', detail: [
      { label: 'Contraloría' },
      { label: 'Procuraduría' },
      { label: 'DNP' },
    ] },
    { label: 'Total' },
  ];

  dataTable: any = [];
  isBrowser: boolean;
  selectedRow!: any;
  loading: boolean = true;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(LOCALE_ID) public locale: string,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    this.dataSourceTable.paginator = this.paginator;

    console.log("appendChild");
    this.panel2Tab.nativeElement.appendChild(this.mapContainer.nativeElement);


  }

  ngOnInit(): void {
    this.items = [
        { label: 'Reports SGR' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === this.selected
    )[0];

    this.fillDataTable();
    //this.createGraph();

    let that = this;
    fetch("/assets/data/entidad_territorial.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("json");
      //that.towns = json;
    });

    fetch("/assets/data/nombre_atributos.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("json");
      that.attrs = json;
    });

    console.log("reading plan recursos sgr", new Date())
    fetch("/assets/data/resumen_plan_recursos_sgr.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("json");
      console.log("finish reading plan recursos sgr", new Date())
      //that.towns = json;
    });

    this.loading = false;

    this.initChart();

    this.initPieChart();

    this.initHorizontalChart();

  }

  expandedRows = {};

  fillDataTable(){
    console.log("fillDataTable");
    this.dataTable = [];
    this.lbls.forEach((l) => {
      let b= this.getRndm(),
      c= this.getRndm(),
      d= this.getRndm(),
      e= this.getRndm(),
      f= this.getRndm();
      if (l.detail){
        let rows: any = [];
        l.detail.forEach((lbl) =>{
          let b= this.getRndm(),
          c= this.getRndm(),
          d= this.getRndm(),
          e= this.getRndm(),
          f= this.getRndm();
          rows.push({
              a: lbl.label,
              b: {x: b, y : b},
              c: {x: c, y : c},
              d: {x: d, y : d},
              e: {x: e, y : e},
              f: {x: f, y : f},
            });
        });
        this.dataTable.push({
          a: l.label,
          b: {x: b, y : b},
          c: {x: c, y : c},
          d: {x: d, y : d},
          e: {x: e, y : e},
          f: {x: f, y : f},
          x : rows
        });
      }else{
        this.dataTable.push({
          a: l.label,
          b: {x: b, y : b},
          c: {x: c, y : c},
          d: {x: d, y : d},
          e: {x: e, y : e},
          f: {x: f, y : f},
          x : []
        });
      }
    });
    /* this.dataSourceTable = new MatTableDataSource<any>(this.dataTable);
    if (this.paginator && this.dataSourceTable)
      this.dataSourceTable.paginator = this.paginator; */
  }

  getRndm() {
    return Math.floor(Math.random() * 1000000);
  }

  optionChange(evt: any) {
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === evt.value
    )[0];
  }

  createGraph() {
    const ctx = this.renderer.selectRootElement(
      '#gaugeChart'
    ) as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d');

    const gradient = ctx2d?.createLinearGradient(0, 0, ctx.width, 0);
    gradient?.addColorStop(0, 'rgba(53, 106, 212, 0.445)');
    gradient?.addColorStop(1, 'rgb(53, 106, 212)');

    const value = this.infoToResume.percent * 100;
    const customPlugin = {
      id: 'customPlugin',
      beforeDraw(chart: any) {
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
      },
    };
    Chart.register(customPlugin);
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Valor Actual'],
        datasets: [
          {
            data: [value, 100 - value],
            backgroundColor: [gradient, '#E0E0E0'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        rotation: -90,
        circumference: 180,
        cutout: '80%',
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }

  clickedRow(row: any) {
    console.log(row);
    this.rowIsClicked = true;
    this.createChart(row);
  }

  selectVariables(evt: any){
    console.log(this.attrSelected);
  }

  createChart(row: any) {
    console.log('createChart, showChart:', this.showChart);
    this.showChart = true;
    if (this.chart == undefined) {
      this.chart = new Chart('chart-canva', {
        type: 'bar', //this denotes tha type of chart
        data: {
          // values on X-Axis
          labels: ['2022-2023', '2024-2025', '2026-2027', '2028-2029', '2030-2031'],
          datasets: [
            {
              label: row.a,
              data: [row.b.x, row.c.x, row.d.x, row.e.x, row.f.x],
              backgroundColor: 'blue',
            },
          ],
        },
        options: {
          aspectRatio: 1.5,
          responsive: true
        },
      });
      console.log(this.chartCanva.nativeElement);
      if (this.chartCanva.nativeElement.style.width == '0px'){
        this.chartCanva.nativeElement.style.width = Math.ceil(this.mainTable.nativeElement.offsetWidth * 0.5) + "px";
        this.chartCanva.nativeElement.style.height = Math.ceil(this.mainTable.nativeElement.offsetWidth * 0.3) + "px";
      }
    } else {
      console.log(this.chart);
      if (
        this.chart.data.datasets[0].label != row.a &&
        this.chart.data.datasets.length == 1
      ) {
        this.chart.data.datasets.push({
          label: row.a,
          data: [row.b.x, row.c.x, row.d.x, row.e.x, row.f.x],
          backgroundColor: '#ff5733',
        });
        this.chart.update();
      }else if (this.chart.data.datasets[0].label != row.a &&
        this.chart.data.datasets[1].label != row.a &&
        this.chart.data.datasets.length == 2){
        this.chart.data.datasets[1].label = row.a;
        this.chart.data.datasets[1].data = [row.b, row.c, row.d, row.e, row.f];
        this.chart.update();
      }else if (this.chart.data.datasets[0].label == row.a &&
        this.chart.data.datasets.length == 2){
        this.chart.data.datasets.shift();
        this.chart.data.datasets[0].backgroundColor = 'blue',
        this.chart.update();
      }else if (this.chart.data.datasets[1].label == row.a &&
        this.chart.data.datasets.length == 2){
        this.chart.data.datasets.pop();
        this.chart.update();
      }
    }

    const timeoutId = setTimeout(() => {
      this.panel1Tab.nativeElement.appendChild(this.chartContainer.nativeElement);
      if (this.chartCanva.nativeElement.style.width == '0px'){
        this.chartCanva.nativeElement.style.width = Math.ceil(this.mainTable.nativeElement.offsetWidth * 0.5) + "px";
        this.chartCanva.nativeElement.style.height = Math.ceil(this.mainTable.nativeElement.offsetWidth * 0.3) + "px";
      }
    }, 1000); // 3 seconds

    //this.panel1Tab.nativeElement.appendChild(this.chartContainer.nativeElement);
  }

  onRowSelect(event: any) {
    console.log("onRowSelect: ", event.data);
    this.clickedRow(event.data);
    //this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
}

  onRowUnselect(event: any) {
      //this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.name });
  }

  basicData: any;
  basicOptions: any;

  initChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.basicData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Reporte Sistema General de Regalías',
                data: [540, 325, 702, 620],
                backgroundColor: [
                    'rgba(98, 171, 239, 0.5)',
                    'rgba(43, 65, 226, 0.5)',
                    'rgb(107, 114, 128, 0.5)',
                    'rgba(51, 12, 209, 0.5)',
                ],
                borderColor: ['rgb(61, 84, 235)', 'rgb(44, 22, 213)', 'rgb(107, 114, 128)', 'rgb(6, 12, 170)'],
                borderWidth: 1,
            },
        ],
    };

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                },
                grid: {
                    color: surfaceBorder,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary,
                },
                grid: {
                    color: surfaceBorder,
                },
            },
        },
    };
    this.cd.markForCheck();

  }

  pieData: any;
  pieChartOptions: any;
  initPieChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.pieData = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-blue-500'), documentStyle.getPropertyValue('--p-gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-blue-400'), documentStyle.getPropertyValue('--p-gray-400')]
            }
        ]
    };

    this.pieChartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
    this.cd.markForCheck()


  }

  horizontalData: any;
  horizontalChartoptions: any;

  initHorizontalChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.horizontalData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
        datasets: [
            {
                label: 'Variable 1',
                backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
                borderColor: documentStyle.getPropertyValue('--p-blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'Variable 2',
                backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    this.horizontalChartoptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
    this.cd.markForCheck()

}

}

export interface TableElement {
  a: string;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
