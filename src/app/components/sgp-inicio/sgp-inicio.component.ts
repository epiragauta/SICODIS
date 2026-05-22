import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { PercentFormatPipe } from '../../utils/percentFormatPipe';
import { BillonesFormatPipe } from '../../utils/billonesFormatPipe';
import { MatIconModule } from '@angular/material/icon';
import { FloatLabel } from 'primeng/floatlabel';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { Router } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem, TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-sgp-inicio',
  standalone: true,
  imports: [CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatGridListModule,
      MatCardModule,
      ButtonModule,
      NumberFormatPipe,
      PercentFormatPipe,
      BillonesFormatPipe,
      MatIconModule,
      FloatLabel,
      InfoPopupComponent,
      SplitButtonModule,
      CardModule,
      Select,
      TreeTableModule,
      Breadcrumb],
  templateUrl: './sgp-inicio.component.html',
  styleUrl: './sgp-inicio.component.scss'
})
export class SgpInicioComponent implements OnInit {

  constructor(private sicodisApiService: SicodisApiService, private router: Router) {}

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  fechaActualizacion = '10 de julio de 2025';
  fechaActual = (() => {
    const fecha = new Date();
    const meses = [
      'enero','febrero','marzo','abril','mayo','junio',
      'julio','agosto','septiembre','octubre','noviembre','diciembre'
    ];
    return `${meses[fecha.getMonth()]} ${fecha.getDate()} de ${fecha.getFullYear()}`;
  })();

  cifras: any = {
    presupuesto: 0,
    distribuido: 0,
    pendiente: 0,
    avance: 0
  };

  treeTableData: TreeNode[] = [];
  historicoApiData: any[] = [];
  totalesSgp: any = null;

  // Select options and selected value
  vigencias: any[] = [
    { value: '2026', label: '2026' },    
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];
  selectedVigencia: any = { value: '2026', label: '2026' };

  recursos = [
    {
      titulo: 'Documentos y Anexos',
      descripcion: 'Documentos de distribución con detalle por cada vigencia, desde 2002.', //'Consulta dos documentos y anexos publicados',
      boton: 'Consultar',
      link: 'sgp-documentos-anexos',
      icon: 'assets/img/sgp/licensing.png'
    },    
    {
      titulo: 'Detalle Presupuestal',
      descripcion: 'Distribución diferenciada por la última doceava y las once doceavas.', //'Consulta el detalle de la información presupuestal',
      boton: 'Consultar',
      link: 'sgp-detalle-presupuestal',
      icon: 'assets/img/sgp/budgeting.png'
    },      
    {
      titulo: 'Tablero Comparativo',
      descripcion: 'Recursos distribuidos de una o dos entidades territoriales.', //'Compara vigencias y entidades',
      boton: 'Consultar',
      link: 'sgp-comparativa',
      icon: 'assets/img/sgp/compare.png'
    },
    {
      titulo: 'Resguardos Indígenas',
      descripcion: 'AESGPRI desagregada por entidad territorial y población certificada.',
      boton: 'Consultar',
      link: 'sgp-resguardos',
      icon: 'assets/img/sgp/indigenous.png',
      download: 'assets/data/sgp/sgp_resguardos_datos.xlsx'
    },      
    {
      titulo: 'Variables Certificadas',
      descripcion: 'Disponibles desde 2002 por entidad territorial.',
      boton: 'Consultar',
      icon: 'assets/img/sgp/segmentation.png',
      download: 'assets/data/sgp/sgp_variables.xlsx'
    },     
    {
      titulo: 'Histórico',
      descripcion: 'Distribuciones desde la vigencia 2002, por entidad territorial y por tipo de asignación (sectorial o especial).', //'Consulta y explora el detalle histórico del sistema',
      boton: 'Consultar',
      link: 'sgp-historico',
      icon: 'assets/img/sgp/analysis.png'
    }
    
    // {
    //   titulo: 'Consulta de eficiencia',
    //   descripcion: 'Eficiencia Propósito General',
    //   boton: 'Consultar',
    //   link: 'sgp-eficiencia',
    //   icon: 'assets/img/sgp/efficiency.png'
    // }
    // ,
    // {
    //   titulo: 'Distribuciones SGP',
    //   descripcion: 'Consulta las proyecciones del sistema',
    //   boton: 'Consultar',
    //   link: 'reports-sgp-dist',
    //   icon: 'assets/img/sgp/forecast.png'
    // },
   
  ];

  ngOnInit(): void {
    this.items = [
        { label: 'SGP Inicio' }        
    ];
    
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.loadSgpData();

  }

  formatFecha(fecha: Date): string {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    
    return `${dia} de ${mes} de ${anio}`;
  }

  loadSgpData(): void {
    console.log("loadSgpData...");
    const year = this.selectedVigencia?.value || 2026;
    this.sicodisApiService.getSgpResumenGeneral(year).subscribe({
      next: (result: any) => {
        let resumen = result[0];
        this.fechaActualizacion = this.formatFecha(new Date(resumen.fecha_ultima_actualizacion));
        this.cifras = {
          presupuesto: resumen.total_presupuesto,
          distribuido: resumen.total_distribuido,
          pendiente: resumen.total_presupuesto - resumen.total_distribuido,
          avance: resumen.porcentaje_avance / 100
        };
        this.loadSgpParticipaciones();
      },
      error: (error) => {
        console.error('Error loading SGP data:', error);
        // Mantener datos por defecto en caso de error
        this.cifras = {
          presupuesto: 70540879911189,
          distribuido: 65200000000000,
          pendiente: 5330879911189,
          avance: 92.5
        };
        this.loadSgpParticipaciones();
      }
    });
  }

  loadSgpParticipaciones(): void {
    console.log("loadSgpParticipaciones...");
    const year = this.selectedVigencia?.value || 2026;
    this.sicodisApiService.getSgpResumenParticipacionesAvance(year).subscribe({
      next: (result: any) => {
        this.historicoApiData = result;
        if (result && result.length > 0) {
          this.buildTreeTableData();
        } else {
          console.log('No hay datos del API');
          this.treeTableData = [];
        }
      },
      error: (error) => {
        console.error('Error loading SGP participaciones:', error);
        this.treeTableData = [];
      }
    });
  }

  buildTreeTableData(): void {
    if (!this.historicoApiData || this.historicoApiData.length === 0) {
      this.treeTableData = [];
      this.totalesSgp = null;
      return;
    }

    // Extraer el registro de totales (codigo_participacion = '99')
    const totalRecord = this.historicoApiData.find(
      item => item.codigo_participacion === '99'
    );

    if (totalRecord) {
      this.totalesSgp = {
        presupuesto: totalRecord.presupuesto,
        distribuido: totalRecord.distribuido,
        pendiente: totalRecord.pendiente_por_distribuir,
        avance: totalRecord.avance / 100
      };
    } else {
      this.totalesSgp = null;
    }

    // Filtrar registros excluyendo codigo_participacion = '99' (Total SGP)
    const filteredData = this.historicoApiData.filter(
      item => item.codigo_participacion !== '99'
    );

    // Crear un mapa de conceptos únicos
    const uniqueConceptos = new Map<string, any>();
    filteredData.forEach(item => {
      if (!uniqueConceptos.has(item.codigo_participacion)) {
        uniqueConceptos.set(item.codigo_participacion, {
          codigo_participacion: item.codigo_participacion,
          participacion: item.participacion,
          presupuesto: item.presupuesto,
          distribuido: item.distribuido,
          pendiente: item.pendiente_por_distribuir, // Usar el campo específico para pendiente
          avance: item.avance
        });
      }
    });

    // Construir estructura de árbol basada en longitud del código
    const conceptosMap = new Map<string, TreeNode>();

    uniqueConceptos.forEach((conceptoInfo, codigoParticipacion) => {
      const conceptoPadreId = codigoParticipacion.substring(0, 4);
      const isConceptoPadre = codigoParticipacion.length === 4;

      if (isConceptoPadre) {
        // Es un concepto padre (nivel 1)
        if (!conceptosMap.has(conceptoPadreId)) {
          const nodeData: any = {
            concepto: conceptoInfo.participacion,
            codigo_participacion: codigoParticipacion,
            presupuesto: conceptoInfo.presupuesto,
            distribuido: conceptoInfo.distribuido,
            pendiente: conceptoInfo.pendiente,
            avance: conceptoInfo.avance / 100
          };

          conceptosMap.set(conceptoPadreId, {
            key: conceptoPadreId,
            data: nodeData,
            children: [],
            expanded: false  // Colapsado por defecto
          });
        }
      } else {
        // Es un concepto hijo (nivel 2+)
        if (!conceptosMap.has(conceptoPadreId)) {
          // Crear concepto padre si no existe (casos edge)
          const parentNodeData: any = {
            concepto: `Concepto ${conceptoPadreId}`,
            codigo_participacion: conceptoPadreId,
            presupuesto: 0,
            distribuido: 0,
            pendiente: 0,
            avance: 0
          };

          conceptosMap.set(conceptoPadreId, {
            key: conceptoPadreId,
            data: parentNodeData,
            children: [],
            expanded: false
          });
        }

        const parentNode = conceptosMap.get(conceptoPadreId)!;
        const existingChild = parentNode.children!.find(
          child => child.key === codigoParticipacion
        );

        if (!existingChild) {
          const childData: any = {
            concepto: conceptoInfo.participacion,
            codigo_participacion: codigoParticipacion,
            presupuesto: conceptoInfo.presupuesto,
            distribuido: conceptoInfo.distribuido,
            pendiente: conceptoInfo.pendiente,
            avance: conceptoInfo.avance / 100
          };

          const childNode: TreeNode = {
            key: codigoParticipacion,
            data: childData,
            leaf: true
          };

          parentNode.children!.push(childNode);
        }
      }
    });

    this.treeTableData = Array.from(conceptosMap.values());
    console.log('Tree table data construida:', this.treeTableData);
  }

  getTreeTableTotal(field: 'presupuesto' | 'distribuido' | 'pendiente'): number {
    // Usar los totales del API si están disponibles
    if (this.totalesSgp && this.totalesSgp[field] !== undefined) {
      return this.totalesSgp[field];
    }

    // Fallback: calcular la sumatoria
    let total = 0;
    this.treeTableData.forEach((node: TreeNode) => {
      total += node.data[field] || 0;
    });
    return total;
  }

  getTreeTableAvanceTotal(): number {
    // Usar el avance del API si está disponible
    if (this.totalesSgp && this.totalesSgp.avance !== undefined) {
      return this.totalesSgp.avance;
    }

    // Fallback: calcular basado en presupuesto y distribuido
    const presupuesto = this.getTreeTableTotal('presupuesto');
    const distribuido = this.getTreeTableTotal('distribuido');
    return presupuesto > 0 ? distribuido / presupuesto : 0;
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia changed:', event.value);
    this.selectedVigencia = event.value;
    // Reload data for the selected year
    this.loadSgpData();
  }

  navigateToResource(link: string): void {
    console.log('Navigating to:', link);
    this.router.navigate([link]).then(() => {
      // Scroll to top after successful navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }


onResourceClick(recurso: any) {

  // Si el recurso tiene un archivo para descargar
  if (recurso.download) {
    this.downloadFile(recurso.download);
    return;
  }

  // Navegación normal
  if (recurso.link) {
    this.navigateToResource(recurso.link);
  }
}

downloadFile(path: string) {
  const link = document.createElement('a');
  link.href = path;
  link.download = path.split('/').pop() || 'variables.xlsx';
  link.click();
}


}
