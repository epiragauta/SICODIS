import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import Chart from 'chart.js/auto';
import { organizeCategoryData, processArrayData} from '../../utils/hierarchicalDataStructure';
import { sgpComparativaDistribucionPorEntidad } from '../../data/sgp-comparativa-distribucion-por-entidad';
import { departamentos } from '../../data/departamentos';
import { TreeTableModule } from 'primeng/treetable';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

interface NodeEvent {
  originalEvent: Event;
  node: TreeNode;
}
@Component({
  selector: 'app-reports-sgp-dist',
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
    ButtonModule,
    TreeTableModule,
    Dialog,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './reports-sgp-dist.component.html',
  styleUrl: './reports-sgp-dist.component.scss',
})
export class ReportsSgpDistComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  
  color1 = 'lightblue';
  color2 = 'lightgreen';
  color3 = 'lightpink';
  selectedYear: string = '2024';
  departmentSelected: string = '';
  townSelected: string = '';

  selectedNode: TreeNode | null = null;
  budgetData: TreeNode[] = [];
  cols: any[] = [];
  years: any = ["2024", "2023", "2022", "2021", "2020", "2019"];
  departamentos = departamentos;

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

  constructor() {}

  ngOnInit(): void {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Distribuciones SGP' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    
    this.cols = [
      { field: 'concepto', header: 'Concepto' },
      { field: '2024', header: '2024' },
      { field: '2025', header: '2025' },
      { field: 'diferencia', header: 'Diferencia' },
      { field: 'variacion', header: 'Variación (%)' }
    ];

    this.loadBudgetData();
  }

  loadBudgetData() {

      this.budgetData = processArrayData(sgpComparativaDistribucionPorEntidad);
      let total: any = this.budgetData.shift();
      this.budgetData.push(total);
      console.log("loadBudgetData", this.budgetData);
    }

  optionChange(evt: any) {

  }

  nodeSelect(event: any) {
    console.log('Node selected:', event.node);
  }

  classConcepto(concepto: string) {
    console.log("classConcepto", concepto);
    if (concepto === '99 - Total SGP') {
      return 'font-bold total';
    } else if (concepto === '1.1 - Educación') {
      return 'font-bold concepto-educacion';
    } else if (concepto === '1.2 - Salud') {
      return 'font-bold concepto-salud';
    } else {
      return '';
    }
  }


}
