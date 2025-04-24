import { Input, ViewChild, ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TreeNode, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartModule } from 'primeng/chart';
import { processArrayData} from '../../utils/hierarchicalDataStructure';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { departamentos } from '../../data/departamentos';
import { ComparativoIacVsPresupuesto } from '../../data/comparativo-iac-vs-presupuesto';
import { territorialEntities } from '../../data/territorial-entities';
import { plantillaComparacionIacVsPresupuestoDetalleEntidad } from '../../data/plantilla-comparacion-iac-vs-presupuesto-detalle-entidad';


interface DocumentInfo {
  name: string;
  url: string;
  type: 'pdf' | 'excel' | 'word' | 'generic';
}

interface NodeInfo {
  title: string;
  description: string;
  documents?: DocumentInfo[];
  moreDetailsUrl?: string;
}

@Component({
  selector: 'app-comparativo-iac-vs-presupuesto',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TreeTableModule,
    ButtonModule,
    SplitButtonModule,
    MatGridListModule,
    ChartModule,
    PopoverModule],
  templateUrl: './comparativo-iac-vs-presupuesto.component.html',
  styleUrl: './comparativo-iac-vs-presupuesto.component.scss'
})
export class ComparativoIacVsPresupuestoComponent {

  @ViewChild('infoPanel') infoPanel!: Popover;

  cols: any[] = [];
  data: TreeNode[] = [];
  platformId = inject(PLATFORM_ID);

  selectedNode: TreeNode | null = null;
  infoMap: Map<string, Map<string, NodeInfo>> = new Map();

  selectedVigencia: any = { id: 1, label: 'Vigencia Bienio 2025 - 2026' };
  selectedSearchType: any = { id: 1, label: 'General' };
  selectedDpto: any = { codigo: '-1', nombre: 'Por departamento' };
  selectedEntity: any;
  selectedDetailEntity: any;

  selectedInfoTitle: string = '';
  selectedInfoDescription: string = '';
  selectedInfoDocuments: DocumentInfo[] = [];
  selectedInfoMoreDetailsUrl: string | undefined = undefined;

  menuItems: MenuItem[];

  territorialEntitiesDetailUrl = '/assets/data/territorial-entities-detail.json';
  detailedDataUrl = '/assets/data/comparativo-iac-vs-presupuesto-detallado-entidades.json';

  templateComparison = plantillaComparacionIacVsPresupuestoDetalleEntidad;

  searchTypes: any[] = [
    { id: 1, label: 'General' },
    { id: 2, label: 'Por departamento' },
    { id: 3, label: 'Por entidad' }
  ];

  vigencia = [
      {
          "id": 1,
          "label": "Vigencia Bienio 2025 - 2026"
      },
      {
          "id": 2,
          "label": "Vigencia Bienio 2023 - 2024"
      },
      {
          "id": 3,
          "label": "Vigencia Bienio 2021 - 2022"
      },
      {
          "id": 4,
          "label": "Vigencia Bienio 2019 - 2020"
      },
      {
          "id": 5,
          "label": "Vigencia Bienio 2017 - 2018"
      },
      {
          "id": 6,
          "label": "Vigencia Bienio 2015 - 2016"
      },
      {
          "id": 7,
          "label": "Vigencia Bienio 2013 - 2014"
      },
      {
          "id": 8,
          "label": "Vigencia 2012"
      }
  ];
  dptos = departamentos;
  entities = territorialEntities;
  detailEntities: any[] = [];
  detailEntitiesFiltered: any[] = [];
  detailedData: any[] = [];
  detailedDataFiltered: any[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.menuItems = [
      {
        label: 'Exportar Reporte',
        icon: 'pi pi-fw pi-file',
        command: () => this.exportData()
      },
      {
        label: 'Exportar Detalle',
        icon: 'pi pi-fw pi-question',
        command: () => this.exportData()
      }
    ];

  }

  ngOnInit() {
    this.cols = [
      { field: 'concepto', header: 'Concepto' },
      { field: 'presupuesto', header: 'Presupuesto/2' },
      { field: 'iac', header: 'Instrucción de abono a cuenta' },
      { field: 'avance-iac-vs-presupuesto', header: 'Avance IAC frente  a presupuesto' }
    ];
    this.loadData();
    this.selectedVigencia = this.vigencia[0];

  }

  loadData() {
    console.log('Loading data...');
    this.data = organizeCategoryData(ComparativoIacVsPresupuesto);
  }

  exportData() {
    console.log('Exportando datos...');
  }

  queryData(){
    console.log("Query Data...");
  }

  hasPresupuestoInfo(rowData: any): boolean {
    return this.hasInfo(rowData.Concepto, 'presupuesto');
  }

  private hasInfo(category: string, field: string): boolean {
    if (!this.infoMap.has(category)) {
      return false;
    }

    const categoryInfo = this.infoMap.get(category);
    return categoryInfo?.has(field) || false;
  }

  showInfo(event: Event, field: string, rowData: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.infoMap.has(rowData.Concepto)) {
      return;
    }

    const categoryInfo = this.infoMap.get(rowData.Concepto);
    const info = categoryInfo?.get(field);

    if (info) {
      this.selectedInfoTitle = info.title;
      this.selectedInfoDescription = info.description;
      this.selectedInfoDocuments = info.documents || [];
      this.selectedInfoMoreDetailsUrl = info.moreDetailsUrl;

      this.infoPanel.show(event);
    }
  }

  updateSelectedSearchType(event: any) {
    console.log('Selected search type:', event.value);
    this.selectedSearchType = event.value;
    switch (this.selectedSearchType.id) {
      case 2:
        this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' };
        break;
      case 3:
        this.selectedEntity = { codigo: '-1', nombre: 'Por entidad' };
        break;
      default:
        break;
    }
  }

  updateSelectedDpto(event: any) {
    console.log('Selected department:', event.value);
    this.selectedDpto = event.value;
    this.updateData(this.selectedDpto.codigo, true);

  }

  updateSelectedEntity(event: any) {
    console.log('Selected entity:', event.value);
    if (this.detailEntities.length == 0) {
      fetch(this.territorialEntitiesDetailUrl)
        .then(response => response.json())
        .then(data => {
          this.detailEntities = data;
          this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre == this.selectedEntity.codigo);
        })
        .catch(error => console.error('Error fetching detail entities:', error));
    }else{
      this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre == this.selectedEntity.codigo);
    }
    this.updateData(this.selectedEntity.codigo);
  }

  updateSelectedDetailEntity(event: any) {
    console.log('Selected detail entity:', event.value);
    this.selectedDetailEntity = event.value;
  }

  updateData(codigo:string, isDpto:boolean = true) {
    console.log('Uopdating data for entity with code:', codigo);
    // console.log('Selected vigencia:', this.selectedVigencia);
    // console.log('Selected search type:', this.selectedSearchType);
    // console.log('Selected department:', this.selectedDpto);
    // console.log('Selected entity:', this.selectedEntity);
    // console.log('Selected detail entity:', this.selectedDetailEntity);


    if (this.detailedData.length == 0) {
      fetch(this.detailedDataUrl)
        .then(response => response.json())
        .then(data => {
          this.detailedData = data;
          this.filterDetailedData(codigo, isDpto);
        })
        .catch(error => console.error('Error fetching detailed data:', error));
    }
    else {
      this.filterDetailedData(codigo, isDpto);
    }

  }

  filterDetailedData(codigo:string, isDpto:boolean = true) {
    console.log('Filtering detailed data...');

    if (isDpto) {
      if (codigo == '05000' || codigo == '08000') {
        codigo = codigo.substring(1,5);
      }
    }
    this.detailedDataFiltered = this.detailedData.filter((item: any) => {
      return item.codDpto  == codigo;
    });
    let template: any = [...this.templateComparison];
    // let idx = template.findIndex((i: any) => i.categoria == '2.1.1.1.1');
    // template[idx].presupuesto = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.presup20AD), 0);
    // template[idx].iac = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.recaudo20AD), 0);
    // template[idx].avance = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.avance20AD.toString().replace(",",".")), 0);
    let data20Ad = this.updateCategoryData('2.1.1.1.1', 'presup20AD', 'recaudo20AD', 'avance20AD', this.detailedDataFiltered, template);

    // idx = template.findIndex((i: any) => i.categoria == '2.1.1.1.2');
    // template[idx].presupuesto = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.presup5ADA), 0);
    // template[idx].iac = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.recaudo5ADA), 0);
    // template[idx].avance = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.avance5ADA.toString().replace(",",".")), 0);
    let data5Ad = this.updateCategoryData('2.1.1.1.2', 'presup5ADA', 'recaudo5ADA', 'avance5ADA', this.detailedDataFiltered, template);
    let idx = template.findIndex((i: any) => i.categoria == '2.1.1.1');
    template[idx].presupuesto = data20Ad.presupuesto + data5Ad.presupuesto;
    template[idx].iac = data20Ad.iac + data5Ad.iac;
    template[idx].avance = data20Ad.avance + data5Ad.avance;

    let presupuestoCorienteInversion = template[idx].presupuesto;
    let iACCorienteInversion = template[idx].iac;
    let avanceCorrienteInversion = template[idx].avance;

    let dataAIRDep = this.updateCategoryData('2.1.1.2.1', 'presupAIRDep', 'recaudoAIRDep', 'avanceAIRDep', this.detailedDataFiltered, template);
    idx = template.findIndex((i: any) => i.categoria == '2.1.1.2');
    template[idx].presupuesto = dataAIRDep.presupuesto;
    template[idx].iac = dataAIRDep.iac;
    template[idx].avance = dataAIRDep.avance;

    presupuestoCorienteInversion += template[idx].presupuesto;
    iACCorienteInversion += template[idx].iac;
    avanceCorrienteInversion += template[idx].avance;

    let dataMADSMMP = this.updateCategoryData('2.1.1.3.1.1', 'presupMADSMMP', 'recaudoMADSMMP', 'avanceMADSMMP', this.detailedDataFiltered, template);
    let dataRIMMP = this.updateCategoryData('2.1.1.3.1.2', 'presupRIMMP', 'recaudoRIMMP', 'avanceRIMMP', this.detailedDataFiltered, template);

    idx = template.findIndex((i: any) => i.categoria == '2.1.1.3.1');
    template[idx].presupuesto = dataMADSMMP.presupuesto + dataRIMMP.presupuesto;
    template[idx].iac = dataMADSMMP.iac + dataRIMMP.iac;
    template[idx].avance = dataMADSMMP.avance + dataRIMMP.avance;

    idx = template.findIndex((i: any) => i.categoria == '2.1.1.3');
    template[idx].presupuesto = dataMADSMMP.presupuesto + dataRIMMP.presupuesto;
    template[idx].iac = dataMADSMMP.iac + dataRIMMP.iac;
    template[idx].avance = dataMADSMMP.avance + dataRIMMP.avance;

    presupuestoCorienteInversion += template[idx].presupuesto;
    iACCorienteInversion += template[idx].iac;
    avanceCorrienteInversion += template[idx].avance;

    idx = template.findIndex((i: any) => i.categoria == '2.1.1');
    template[idx].presupuesto = presupuestoCorienteInversion;
    template[idx].iac = iACCorienteInversion;
    template[idx].avance = avanceCorrienteInversion;


    const dataFAE = this.updateCategoryData('2.1.2.1', 'presupFAE', 'recaudoFAE', 'avanceFAE', this.detailedDataFiltered, template);
    const dataFONPET = this.updateCategoryData('2.1.2.2', 'presupFONPET', 'recaudoFONPET', 'avanceFONPET', this.detailedDataFiltered, template);

    idx = template.findIndex((i: any) => i.categoria == '2.1.2');
    template[idx].presupuesto = dataFAE.presupuesto + dataFONPET.presupuesto;
    template[idx].iac = dataFAE.iac + dataFONPET.iac;
    template[idx].avance = dataFAE.avance + dataFONPET.avance;

    idx = template.findIndex((i: any) => i.categoria == '2.1');
    template[idx].presupuesto = presupuestoCorienteInversion + dataFAE.presupuesto + dataFONPET.presupuesto;
    template[idx].iac = iACCorienteInversion + dataFAE.iac + dataFONPET.iac;
    template[idx].avance = avanceCorrienteInversion + dataFAE.avance + dataFONPET.avance;

    idx = template.findIndex((i: any) => i.categoria == '2');
    template[idx].presupuesto = presupuestoCorienteInversion + dataFAE.presupuesto + dataFONPET.presupuesto;
    template[idx].iac = iACCorienteInversion + dataFAE.iac + dataFONPET.iac;
    template[idx].avance = avanceCorrienteInversion + dataFAE.avance + dataFONPET.avance;

    const dataRFAD20 = this.updateCategoryData('2.2.1.1.1', 'presupRFAD20', 'recaudoRFAD20', 'avanceRFAD20', this.detailedDataFiltered, template);

    const dataArt9AD20 = this.updateCategoryData('2.2.1.1.2', 'presupArt9AD20', 'recaudoArt9AD20', 'avanceArt9AD20', this.detailedDataFiltered, template);
    idx = template.findIndex((i: any) => i.categoria == '2.2.1.1');
    template[idx].presupuesto = dataRFAD20.presupuesto + dataArt9AD20.presupuesto;
    template[idx].iac = dataRFAD20.iac + dataArt9AD20.iac;
    template[idx].avance = dataRFAD20.avance + dataArt9AD20.avance;
    idx = template.findIndex((i: any) => i.categoria == '2.2.1');
    template[idx].presupuesto = dataRFAD20.presupuesto + dataArt9AD20.presupuesto;
    template[idx].iac = dataRFAD20.iac + dataArt9AD20.iac;
    template[idx].avance = dataRFAD20.avance + dataArt9AD20.avance;


    idx = template.findIndex((i: any) => i.categoria == '2.2.2.1');
    let presupuesto = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.presupReintAD20), 0) +
                      this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.presupReintACTI21), 0);
    template[idx].presupuesto = presupuesto;
    let iac = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.recaudoReintAD20), 0) +
                this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.recaudoReintACTI21), 0);
    template[idx].iac = iac;
    let avance = this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.avanceReintAD20.toString().replace(",",".")), 0) +
                this.detailedDataFiltered.reduce((acc: number, item: any) => acc + parseFloat(item.avanceReintACTI21.toString().replace(",",".")), 0);
    template[idx].avance = avance;

    idx = template.findIndex((i: any) => i.categoria == '2.2.2');
    template[idx].presupuesto = presupuesto;
    template[idx].iac = iac;
    template[idx].avance = avance;

    idx = template.findIndex((i: any) => i.categoria == '2.2');
    template[idx].presupuesto = dataRFAD20.presupuesto + dataArt9AD20.presupuesto + presupuesto;
    template[idx].iac = dataRFAD20.iac + dataArt9AD20.iac + iac;
    template[idx].avance = dataRFAD20.avance + dataArt9AD20.avance + avance;

    idx = template.findIndex((i: any) => i.categoria == '1');
    template[idx].presupuesto = presupuestoCorienteInversion + dataFAE.presupuesto + dataFONPET.presupuesto +
                                dataRFAD20.presupuesto + dataArt9AD20.presupuesto + presupuesto;
    template[idx].iac = iACCorienteInversion + dataFAE.iac + dataFONPET.iac + dataRFAD20.iac + dataArt9AD20.iac + iac;
    template[idx].avance = avanceCorrienteInversion + dataFAE.avance + dataFONPET.avance + dataRFAD20.avance + dataArt9AD20.avance + avance;


    this.data = organizeCategoryData(template);

    console.log('Filtered detailed data:', this.detailedData);
  }

  updateCategoryData(idCategory: string, fieldPresupuesto: string, fieldRecaudo: string, fieldAvance: string, data: any, template: any) {
    let idx = template.findIndex((i: any) => i.categoria ==  idCategory);
    if (idx !== -1) {
      template[idx].presupuesto = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldPresupuesto]), 0);
      template[idx].iac = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldRecaudo]), 0);
      template[idx].avance = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldAvance].toString().replace(",",".")), 0);
    }
    console.log('Updated category data:', template[idx]);
    return template[idx];
  }

}
