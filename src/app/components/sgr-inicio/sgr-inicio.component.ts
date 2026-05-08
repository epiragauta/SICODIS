import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { PercentFormatPipe } from '../../utils/percentFormatPipe';
import { Router } from '@angular/router';
import { SicodisApiService, SgrPtoRecaudoItem, Vigencia } from '../../services/sicodis-api.service';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';

@Component({
  selector: 'app-sgr-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    ButtonModule,
    Select,
    TreeTableModule,
    NumberFormatPipe,
    PercentFormatPipe
  ],
  templateUrl: './sgr-inicio.component.html',
  styleUrl: './sgr-inicio.component.scss'
})
export class SgrInicioComponent implements OnInit {
  platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private sicodisApiService: SicodisApiService) {}

  vigencias: Vigencia[] = [];
  selectedVigencia: Vigencia = { id_vigencia: 0, vigencia: '' };

  presupuestoTotal: number = 0;
  recaudoTotal: number = 0;
  avanceTotal: number = 0;
  saldoTotal: number = 0;

  treeTableData: TreeNode[] = [];

  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  recursos = [
    {
      titulo: 'Programación',
      descripcion: 'Plan de Recursos y Plan Bienal de Caja',
      link: 'sgr-plan-bienal-de-caja',
      icon: 'assets/img/sgr/icono-sgr-programacion.png'
    },
    {
      titulo: 'Recaudo Mensual',
      descripcion: 'Recaudo mes a mes por asignación y beneficiarios',
      link: 'sgr-recaudo-mensual',
      icon: 'assets/img/sgr/icono-sgr-recaudo-mensual.png'
    },
    {
      titulo: 'Recaudo Directas',
      descripcion: 'Recaudo mes a mes por sector para las Asignaciones Directas',
      link: 'sgr-recaudo-directas',
      icon: 'assets/img/sgr/icono-sgr-recaudo-directas.png'
    },
    {
      titulo: 'Recaudo-Presupuesto',
      descripcion: 'Avance del recaudo frente al presupuesto por asignación y beneficiarios',
      link: 'sgr-presupuesto-y-recaudo',
      icon: 'assets/img/sgr/icono-sgr-recaudo-presupuesto.png'
    },
    {
      titulo: 'Comparativo',
      descripcion: 'Avance del recaudo y el presupuesto entre entidades.',
      link: 'sgr-comparativo',
      icon: 'assets/img/sgr/icono-sgr-comparativo.png'
    },
    {
      titulo: 'Administración y SSEC',
      descripcion: 'Funcionamiento, fiscalización y Sistema de Seguimiento Evaluación y Control',
      link: 'reporte-funcionamiento',
      icon: 'assets/img/sgr/icono-sgr-administracion-y-ssec.png'
    },
    {
      titulo: 'Geovisor',
      descripcion: 'Avance del recaudo y el presupuesto entre entidades.',
      link: 'mapa-recursos',
      icon: 'assets/img/sgr/icono-sgr-geovisorpng.png'
    }
  ];

  ngOnInit(): void {
    this.loadVigencias();
  }

  loadVigencias(): void {
    this.sicodisApiService.getSgrVigenciasQa().subscribe({
      next: (vigencias) => {
        this.vigencias = vigencias;
        if (vigencias.length > 0) {
          this.selectedVigencia = vigencias[0];
          this.loadData();
        }
      },
      error: () => {
        this.vigencias = [
          { id_vigencia: 7, vigencia: '2025 - 2026' },
          { id_vigencia: 6, vigencia: '2023 - 2024' },
          { id_vigencia: 5, vigencia: '2021 - 2022' }
        ];
        this.selectedVigencia = this.vigencias[0];
        this.loadData();
      }
    });
  }

  loadData(): void {
    const idVigencia = this.selectedVigencia.id_vigencia;

    this.sicodisApiService.getSGRFechasActualizacionCorteRecaudoIACVigencia(idVigencia).subscribe({
      next: (fechas) => {
        if (fechas && fechas.length > 0) {
          this.fechaActualizacion = fechas[0].fecha_actualizacion;
          this.fechaCorteRecaudo = fechas[0].fecha_corte_recaudo;
        }
      },
      error: () => {}
    });

    this.sicodisApiService.getSgrResumenPtoRecaudoQA(idVigencia, '1', '0').subscribe({
      next: (data) => {
        this.buildTreeTableData(data);
      },
      error: () => {
        this.presupuestoTotal = 64087661072292;
        this.recaudoTotal = 49658264357763;
        this.avanceTotal = 0.7748;
        this.saldoTotal = this.presupuestoTotal - this.recaudoTotal;
        this.treeTableData = [];
      }
    });
  }

  buildTreeTableData(data: SgrPtoRecaudoItem[]): void {
    const TOTAL_CONCEPTO = 'TOTAL SGR (incluye aforado y no aforado)';
    const totalRecord = data.find(
      item => item.concepto === TOTAL_CONCEPTO || item.categoria === 'total'
    );
    if (totalRecord) {
      this.presupuestoTotal = totalRecord.presupuesto_total_vigente;
      this.recaudoTotal = totalRecord.caja_total;
      this.avanceTotal = totalRecord.avance_iac_presupuesto;
      this.saldoTotal = this.presupuestoTotal - this.recaudoTotal;
    }

    const treeData = data.filter(
      item => item.concepto !== TOTAL_CONCEPTO && item.categoria !== 'total'
    );
    const organized = organizeCategoryData(treeData);
    this.treeTableData = this.mapTreeNodes(organized);
  }

  private mapTreeNodes(nodes: any[]): TreeNode[] {
    return nodes.map(node => ({
      key: node.data.categoria,
      data: {
        concepto: node.data.concepto,
        presupuesto: node.data.presupuesto_total_vigente,
        recaudo: node.data.caja_total,
        saldo: node.data.presupuesto_total_vigente - node.data.caja_total,
        avance: node.data.avance_iac_presupuesto
      },
      children: node.children?.length ? this.mapTreeNodes(node.children) : [],
      expanded: false
    }));
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    this.selectedVigencia = event.value;
    this.loadData();
  }

  onResourceClick(recurso: any): void {
    if (recurso.link) {
      this.router.navigate([recurso.link]).then(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      });
    }
  }
}
