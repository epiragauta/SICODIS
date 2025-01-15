import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Dialog } from 'primeng/dialog';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports-sgr-bienal',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    TableModule,
    ButtonModule,
    Dialog
  ],
  templateUrl: './reports-sgr-bienal.component.html',
  styleUrl: './reports-sgr-bienal.component.scss',
})
export class ReportsSgrBienalComponent {
  color1 = 'lightblue';
  color2 = 'lightgreen';
  color3 = 'lightpink';
  selected: string = '2024';
  tableClass = "p-datatable-sm";

  visibleDlgDetail: boolean = false;
  visibleDlgFiles: boolean = false;



  expandedRows = {};

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
    { desc: 'Fonpet Asignaciones Especiales', value: 0 },
    { desc: 'Total SGP', value: 70540879911189 },
  ];

  dataSource2: any = [
    { desc: 'Educación', value: 23740455119716 , detail : [
      {desc: 'Prestación Servicios', value: 22605127495868},
      {desc: 'Calidad', value: 1135237623848}]
    },
    { desc: 'Salud', value: 10361244440826, detail : [
      {desc: 'Régimen Subsidiado', value: 8428995552662},
      {desc: 'Salud Pública', value: 966124444082},
      {desc: 'Subsidio a la oferta', value: 966124444082}]
    },
    { desc: 'Agua Potable', value: 3624435882562, detail: [] },
    { desc: 'Propósito General', value: 7785825229209, detail : [
      {desc: 'Libre destinación', value: 8428995552662},
      {desc: 'Deporte', value: 966124444082},
      {desc: 'Cultura', value: 966124444082}] },
    { desc: 'Alimentación Escolar', value: 349579078179, detail: [] },
    { desc: 'Ribereños', value: 55932652509, detail: [] },
    { desc: 'Resguardos Indígenas', value: 363562241306, detail: [] },
    { desc: 'Fonpet Asignaciones Especiales', value: 2281446083719, detail: [] },
    { desc: 'Total SGP', value: 70540879911189, detail: [] },
  ];

  departments: any = [
    { name: 'Amazonas' },
    { name: 'Bolivar' },
    { name: 'Boyacá' },
    { name: 'Casanare' },
    { name: 'Cesar' },
    { name: 'Cundinamarca' },
  ];
  towns: any = [
    { name: 'Municipio1' },
    { name: 'Municipio2' },
    { name: 'Municipio3' },
    { name: 'Municipio4' },
    { name: 'Municipio5' },
    { name: 'Municipio6' },
    { name: 'Municipio7' },
    { name: 'Municipio8' },
    { name: 'Municipio9' },
    { name: 'Municipio10' },
    { name: 'Municipio11' },
    { name: 'Municipio12' },
  ];
  displayedColumns: string[] = ['desc', 'value'];
  infoYear: any;
  infoToResume: any;
  departmentSelected: string = '';
  townSelected: string = '';

  distributionData = [
    {
        "a": "1285",
        "b": "28/10/2024",
        "c": "Documento de Distribución SGP-94-2024",
        "d": "Distribución final de las doce doceavas de la participación para educación por el criterio de población atendida (complemento) y ajuste al componente calidad - gratuidad educativa y calidad - matrícula oficial, en condiciones de equidad y eficiencia, vige",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "3.210.317.896.216"
    },
    {
        "a": "1284",
        "b": "11/09/2024",
        "c": "Documento de Distribución SGP-93-2024",
        "d": "Distribución de las once doceavas de la asignación especial con destino al Fondo Nacional de Pensiones de las Entidades Territoriales (FONPET), vigencia 2024.",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "2.054.209.279.003"
    },
    {
        "a": "1283",
        "b": "21/06/2024",
        "c": "Documento de Distribución SGP-92-2024",
        "d": "Distribución parcial de las doce doceavas de la participación para educación por el criterio de población atendida (complemento, cancelaciones) y ajuste al porcentaje autorizado para gastos administrativos, vigencia 2024",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "10.122.804.765.599"
    },
    {
        "a": "1282",
        "b": "07/05/2024",
        "c": "Documento de Distribución SGP-91-2024",
        "d": "Distribución de las once doceavas para el municipio Nuevo Belén de Bajirá, y de cinco de las once doceavas para el resto de las entidades beneficiarias, de las participaciones para salud, agua potable y saneamiento básico, propósito general y de las asign",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "11.507.233.658.066"
    },
    {
        "a": "1281",
        "b": "12/04/2024",
        "c": "Documento de Distribución SGP-90-2024",
        "d": "Ajuste a la distribución parcial de las doce doceavas de la participación para educación por el criterio de población atendida (prestación del servicio educativo), vigencia 2024",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "2.914.027.154.988"
    },
    {
        "a": "1279",
        "b": "22/03/2024",
        "c": "Documento de Distribución SGP-89-2024",
        "d": "Distribución parcial de la participación para educación, componentes de calidad – gratuidad educativa y calidad - matrícula oficial en condiciones de equidad y eficiencia, vigencia 2024.",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "1.417.621.619.503"
    },
    {
        "a": "1278",
        "b": "27/02/2024",
        "c": "Documento de Distribución SGP-88-2024",
        "d": "Distribución de seis de las once doceavas de los recursos de la participación sectorial para propósito general, vigencia 2024.",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "3.770.855.944.960"
    },
    {
        "a": "1277",
        "b": "13/02/2024",
        "c": "Documento de Distribución SGP-87-2024",
        "d": "Distribución de seis de las once doceavas de los recursos de la participación para salud (componente salud pública y subsidio a la oferta), y de las asignaciones especiales para alimentación escolar y resguardos indígenas; y de las once doceavas de la asi",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "1.430.414.967.135"
    },
    {
        "a": "1276",
        "b": "12/02/2024",
        "c": "Documento de Distribución SGP-86-2024",
        "d": "Distribución de seis de las once doceavas de los recursos de la participación para agua potable y saneamiento básico, vigencia 2024.",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "1.755.398.457.123"
    },
    {
        "a": "1275",
        "b": "31/01/2024",
        "c": "Documento de Distribución SGP-85-2024",
        "d": "Distribución de seis de las once doceavas de los recursos del sistema general de participaciones para salud, componente de aseguramiento en salud de los afiliados al régimen subsidiado, vigencia 2024.",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "6.901.675.071.594"
    },
    {
        "a": "1274",
        "b": "02/01/2024",
        "c": "Documento de Distribución SGP-84-2024",
        "d": "Distribución parcial de las doce doceavas de la participación para educación por el criterio de población atendida (prestación del servicio educativo, conectividad, cancelaciones), ajuste prestación del servicio educativo vigencia 2023, y autorización de ",
        "e": "Distribuciones Parciales de la Vigencia                                                                                                                                                                 ",
        "f": "2024",
        "g": "22.021.127.469.848"
    },
    {
        "a": "1273",
        "b": "28/12/2023",
        "c": "Documento de Distribución SGP-83-2023",
        "d": "Distribución de la última doceava y mayor valor de la participación para salud, agua potable y saneamiento básico, propósito general y de las asignaciones especiales (alimentación escolar, municipios ribereños del río magdalena, resguardos indígenas y Fon",
        "e": "Ultima Doceava                                                                                                                                                                                          ",
        "f": "2023",
        "g": "3.435.193.627.154"
    }
  ]

  distributionName = "";
  distributionDate = "";
  distributionFiles: any = [];


  constructor(private renderer: Renderer2,) {}

  ngOnInit(): void {
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === this.selected
    )[0];

  }

  optionChange(evt: any) {
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === evt.value
    )[0];
    this.selected = evt.value;
  }




}
