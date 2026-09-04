import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
    ProgressSpinnerModule,
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

  isLoading: boolean = true;

  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  recursos = [
    {
      titulo: 'Plan de Recursos',
      descripcion: 'Plan de Recursos',
      link: 'sgr-plan-bienal-de-caja',
      icon: 'assets/img/sgr/icono-sgr-plan-recursos.png'
    },{
      titulo: 'Plan Bienal de Caja',
      descripcion: 'Plan Bienal de Caja',
      link: 'sgr-plan-bienal-de-caja',
      icon: 'assets/img/sgr/icono-sgr-pbc.png'
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
        } else {
          this.isLoading = false;
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
    this.isLoading = true;

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
        this.isLoading = false;
      },
      error: () => {
        this.presupuestoTotal = 64087661072292;
        this.recaudoTotal = 49658264357763;
        this.avanceTotal = 0.7748;
        this.saldoTotal = this.presupuestoTotal - this.recaudoTotal;
        this.treeTableData = [];
        this.isLoading = false;
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
      item =>
        item.concepto !== TOTAL_CONCEPTO &&
        item.categoria !== 'total' &&
        !(item.concepto?.toUpperCase().includes('TOTAL AFORADO'))
    );
    const organized = organizeCategoryData(treeData);
    const sorted = this.sortRootNodes(organized);
    this.treeTableData = this.mapTreeNodes(sorted);
  }

  private readonly CONCEPTO_ORDER: string[] = [
    'INVERSIÓN',
    'AHORRO',
    'ADMINISTRACIÓN',
    'RECAUDO CORRIENTE NO AFORADO',
    'OTROS'
  ];

  private sortRootNodes(nodes: any[]): any[] {
    return [...nodes].sort((a, b) => {
      const ai = this.CONCEPTO_ORDER.findIndex(
        o => a.data.concepto?.toUpperCase().includes(o)
      );
      const bi = this.CONCEPTO_ORDER.findIndex(
        o => b.data.concepto?.toUpperCase().includes(o)
      );
      const aIdx = ai === -1 ? this.CONCEPTO_ORDER.length : ai;
      const bIdx = bi === -1 ? this.CONCEPTO_ORDER.length : bi;
      return aIdx - bIdx;
    });
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

  // Notas por vigencia (id_vigencia). La nota (1) "Cifras en pesos corrientes"
  // se mantiene estática en la plantilla; estas se agregan a partir de la (2).
  notasVigencia: Record<number, string[]> = {
    8: ['(2) Ley 2441 de 2024 - Decretos 379, Decreto 380, Decreto 0070, Resolución 1169, Decreto 0854, Decreto 1165, Resolución 3158, todos del año 2025. Decretos 0043, 0110, 0288 del 2026.'],
    7: ['(2) Fuente: Decreto 379 del 31 de marzo de 2025'],
    6: ['(2) Fuente: Decreto 363 del 16 de marzo de 2023'],
    5: ['(2) Fuente: Decreto 317 del 30 de marzo de 2021',
        '•\tPara el concepto "FDR - Compensación", el recaudo de ingresos corrientes contiene la compensación establecida en el Decreto 599 de 2020 por valor de $733.855.017.884',
        '•\tLa compensación establecida en el Decreto 1131 de 2019, es descontada de los recursos de disponibilidad inicial y del saldo de mayor recaudo de las entidades correspondientes.'
      ],
    4: ['(2) Fuente: Decreto 606 del 05 de abril de 2019',
        '•\tEl recaudo de ingresos corrientes contiene la compensación establecida en el Decreto 737 de 2018',
        '•\tLa compensación establecida en el Decreto 2152 de 2017, aplica sobre los recursos de disponibilidad inicial. '
      ],
    3: ['(2) Fuente: Decreto 1103 del 27 de junio de 2017',
        '•\tEl recaudo de ingresos corrientes contiene la compensación establecida en los Decretos 724 y 1296 de 2015',
        '•\tLa compensación establecida en el Decreto 1490 de 2015, es descontada de los recursos de disponibilidad inicial y del saldo de mayor recaudo de las entidades correspondientes. '
      ],
    2: ['(2) Fuente: Decreto 722 del 17 de abril de 2015'],
    1: ['(2) Fuente: Decreto 1399 del 28 de junio de 2013'],
  };

  get notasActuales(): string[] {
    const id = this.selectedVigencia?.id_vigencia;
    return this.notasVigencia[id] ?? [];
  }
}
