import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MatIconModule } from '@angular/material/icon';
import { FaqItem, FaqItemComponent } from '../faq-item/faq-item.component';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

interface FaqSection {
  title: string;
  icon: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    MatIconModule,
    Breadcrumb
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  faqSections: FaqSection[] = [
    {
      title: 'Sistema General de Participaciones (SGP)',
      icon: 'account_balance',
      items: [
        {
          title: '¿Qué es el Sistema General de Participaciones?',
          content: 'El Sistema General de Participaciones (SGP) es el mecanismo establecido por la Constitución y la ley para distribuir recursos del presupuesto nacional hacia las entidades territoriales (departamentos, distritos y municipios) para financiar los servicios a su cargo, en especial educación, salud, agua potable y saneamiento básico.',
          route: 'reports-sgp',
          value: '0'
        },
        {
          title: '¿Cómo consultar la distribución de recursos del SGP por entidad territorial?',
          content: 'Puede consultar la distribución comparativa de recursos SGP por entidad territorial, visualizando las variaciones año a año y los criterios de distribución aplicados.',
          route: 'reports-sgp-dist',
          value: '1'
        },
        {
          title: '¿Dónde puedo ver el presupuesto SGP por vigencia?',
          content: 'En la ficha presupuestal SGP puede consultar los recursos asignados por entidad territorial, correspondientes a las doceavas distribuidas en cada vigencia.',
          route: 'reports-sgp-budget',
          value: '2'
        },
        {
          title: '¿Cómo ver la evolución histórica del SGP?',
          content: 'Puede consultar las gráficas de evolución del SGP desde 2005, tanto en precios corrientes como constantes, incluyendo el análisis por cada participación (educación, salud, agua potable, propósito general).',
          route: 'graphics-sgp',
          value: '3'
        }
      ]
    },
    {
      title: 'Sistema General de Regalías (SGR)',
      icon: 'oil_barrel',
      items: [
        {
          title: '¿Qué son las regalías?',
          content: 'Contraprestación económica que recibe el Estado por la explotación de un recurso natural no renovable cuya producción se extingue por el transcurso del tiempo.',
          route: 'reports-sgr',
          value: '4'
        },
        {
          title: '¿Qué es Sicodis?',
          content: 'Es un Sistema de información y consulta de los recursos distribuidos por el DNP: i) Sistema General de Participaciones (SGP); ii) Sistema General de Regalías (SGR); iii) regionalización del Presupuesto General de la Nación (PGN).',
          route: 'reports-sgr-bienal',
          value: '5'
        },
        {
          title: '¿Cuál información de regalías se puede consultar en Sicodis?',
          content: 'Se puede consultar la información presupuestal y la distribución del recaudo corriente y otros ingresos como rendimientos financieros, mayor recaudo, desahorro, entre otros. Esto según las funciones del DNP. La información de giros, pagos, y en general la ejecución presupuestal de los recursos del SGR es información que dispone el Ministerio de Hacienda y Crédito Público atendiendo las funciones que le corresponden a este ministerio. La información del SGR en Sicodis se encuetra desde el año 2012 (único año en que no fue bienal el presupuesto), hasta el bienio en ejecución.',
          route: 'reports-sgr-comparative',
          value: '6'
        },
        {
          title: '¿Qué es el SGR?',
          content: 'Es el conjunto de ingresos, asignaciones, órganos, procedimientos y regulaciones, para el uso eficiente y la destinación de los ingresos provenientes de la explotación de los recursos naturales no renovables.',
          route: 'comparativo-iac-presupuesto',
          value: '7'
        },
        {
          title: '¿Qué son los ingresos corrientes?',
          content: 'Corresponde a los recursos proyectados que se esperan recaudar durante el bienio por la explotación de los recursos naturales no renovables (RNNR), como minerales, hidrocarburos, gas. Se incluyen en el Plan de Recursos (PR), el presupuesto bienal, y el Plan Bienal de Caja (PBC).',
          route: 'reports-sgr-resumen-plan-recursos',
          value: '8'
        },
        {
          title: '¿Qué son los ingresos no corrientes?',
          content: 'Corresponde a los recursos apropiados en la ley bienal de presupuesto o mediante decreto, como rendimientos financieros, desahorro, multas y sanciones entre otros, que no dependen del recaudo por la explotación directa de los recursos naturales no renovables (RNNR) durante el bienio.',
          route: 'propuesta-resumen-sgr',
          value: '9'
        },
        {
          title: '¿Qué es una instrucción de abono a cuenta (IAC)?',
          content: 'Es una comunicación que remite el DNP al Ministerio de Hacienda y Crédito Público con los montos resultantes de la distribución de los recursos del SGR, para ser abonados a las cuentas de cada beneficiario de estos recursos,  para que efectúe los pagos a través del Sistema de Presupuesto y Giro de Regalías (SPGR) y ordene el pago de las obligaciones legalmente adquiridas directamente desde la cuenta única del SGR a las cuentas bancarias de los destinatarios finales. Las IAC pueden ser: i) mensuales, las cuales corresponden a la distribución de los ingresos corrientes, ii)  en cualquier momento del bienio, una vez se expida el decreto de apropiación presupuestal de otros ingresos no corrientes.',
          route: 'propuesta-resumen-sgr',
          value: '10'
        },   
        {
          title: '¿Qué es el recaudo no aforado?',
          content: 'Recursos recaudados por la explotación de los recursos naturales no renovables (RNNR) que superan la apropiación presupuestal corriente del bienio, es decir el monto aforado en la ley bienal de presupuesto.',
          route: 'propuesta-resumen-sgr',
          value: '11'
        },          
        {
          title: '¿Qué es el recaudo no aforado de Asiganciones Directas?',
          content: 'Recursos que superan la apropiación presupuestal corriente por beneficiario en esta asignación, durante la ejecución del presupuesto.  Al cierre del bienio, si el recaudo supera el presupuesto total corriente (el presupuestado para todo el Sistema), estos recursos no aforados se constituyen en mayor recaudo y se distribuyen según las reglas señaladas en la normativa vigente.',
          route: 'propuesta-resumen-sgr',
          value: '12'
        },  
        {
          title: '¿Qué es el Plan de Recursos (PR)?',
          content: 'Es una proyección de las fuentes de financiamiento a diez años del SGR por minería e hidrocarburos. Corresponde al MHCP elaborar el documento técnico de este plan. El DNP efectúa la distribución de la proyección de recursos contenida en el documento técnico del Plan de Recursos, entre asignaciones, beneficiarios y conceptos de gasto para cada uno de los diez años. De esta distribución, los dos primeros años constituyen el proyecto de presupuesto que se radica en el Congreso de la República para su aprobación.',
          route: 'propuesta-resumen-sgr',
          value: '13'
        },
        {
          title: '¿Qué es el Plan Bienal de Caja (PBC)?',
          content: 'Herramienta a través de la cual se determinan los flujos estimados de ingresos mensuales de recursos del presupuesto corriente bienal del SGR, durante los 24 meses de la ejecución presupuestal.',
          route: 'propuesta-resumen-sgr',
          value: '14'
        },                    
        {
          title: '¿Qué son los recursos naturales no renovables (RNNR)?',
          content: 'Recursos que existen en una cantidad concreta y limitada, que se han formado durante miles de años, por ejemplo, el petróleo, el carbón, el gas natural, entre otros. Producto de la explotación de estos recursos se genera a favor del Estado, una contraprestación económica a título de regalía.',
          route: 'propuesta-resumen-sgr',
          value: '15'
        },                    
        {
          title: '¿Quién realiza la destinación de recursos para grupos étnicos?',
          content: 'Los municipios y departamentos son los responsables de realizar el cálculo de destinaciones étnicas para la financiación de proyectos de inversión con enfoque diferencial, si cumplen con las siguientes condiciones: i) tener presupuesto corriente de Asignaciones Directas; ii) contar con Pueblos y Comu­nidades Indígenas y Comunidades Negras, Afrocolombianas, Rai­zales y Palenqueras acreditadas por el Ministerio del Interior, que residan en el territorio. El DNP publica las variables necesarias para la distribución y realiza un cálculo indicativo que debe ser validado por los municipios y gobernaciones. Estos recursos no se incluyen como apropiaciones presupuestales en la ley bienal de presupuesto.',
          route: 'propuesta-resumen-sgr',
          value: '16'
        },
        {
          title: '¿Cuál entidad se encarga de realizar el giro de recursos de regalías?',
          content: 'Los recursos del SGR no se giran a cuentas maestras de los beneficiarios de estos recursos.  La ejecución presupuestal se realiza a través del Sistema de Presupuesto y Giro de Regalías (SPGR) administrado por el Ministerio de Hacienda, desde donde se  ordena el pago de las obligaciones legalmente adquiridas a las cuentas bancarias de los destinatarios finales.',
          route: 'propuesta-resumen-sgr',
          value: '17'
        },
        {
          title: '¿Dónde puede encontrar una entidad territorial información sobre su presupuesto del SGR?',
          content: 'En los módulos de Sicodis del SGR. Puede ubicar una consulta que compara el presupuesto con el recaudo a la fecha. Todos los meses se comunican nuevos recursos del SGR para los beneficiarios del presupuesto corriente, el cual depende del recaudo de regalías por la explotación de minería e hidrocarburos. En el caso de las entidades productoras (donde se explotan minerales e hidrocarburos), depende el flujo de ingresos mensuales de Asignaciones Directas de la producción y comercialización de estas materias primas.',
          route: 'propuesta-resumen-sgr',
          value: '18'
        },
        {
          title: '¿Cómo distribuye los recursos del SGR el DNP? ',
          content: 'El DNP distribuye los recursos del SGR atendiendo los criterios de distribución y las variables certificadas por las entidades competentes, según lo señalado en la normativa vigente. Dentro de las variables requeridas para la distribución están la población, Índice de Necesidades Básicas Insatisfechas, desempleo, pasivo pensional no cubierto.',
          route: 'propuesta-resumen-sgr',
          value: '19'
        },
        {
          title: '¿Quién distribuye el 2,32% para Grupos Étnicos? ',
          content: 'Los distribuye el DNP para cada grupo étnico, a partir del total de las proyecciones de ingresos del SGR para el bienio así: 1% para Pueblos y Comunidades Indígenas; 1,1% para las Comunidades Negras, Afrocolombianas, Raizales y Palenqueras, 0,22% para el Pueblo Rrom o Gitano.',
          route: 'propuesta-resumen-sgr',
          value: '20'
        },        
        {
          title: '¿Cuáles entidades son competentes para realizar la distribución de recursos del SGR?',
          content: 'Las agencias Nacional de Minería y Nacional de Hidrocarburos distribuyen los recursos de Asignaciones Directas para cada beneficiario. El DNP distribuye los demás recursos que se destinan a inversión, ahorro y Sistema de Seguimiento.  En el caso de funcionamiento la determinación de las apropiaciones presupuestales por beneficiario la realiza la Comisión Rectora del SGR, y para fiscalización lo realiza el Ministerio de Minas y Energía.',
          route: 'propuesta-resumen-sgr',
          value: '21'
        },        

      ]
    },
    // {
    //   title: 'Herramientas de Consulta y Análisis',
    //   icon: 'analytics',
    //   items: [
    //     {
    //       title: '¿Cómo usar el tablero de control (Dashboard)?',
    //       content: 'El dashboard presenta un resumen ejecutivo con las principales métricas del SGP y SGR, incluyendo gráficos interactivos y mapas de distribución territorial.',
    //       route: 'dashboard',
    //       value: '10'
    //     },
    //     {
    //       title: '¿Qué información muestra el mapa de distribución?',
    //       content: 'El mapa interactivo permite visualizar geográficamente la distribución de recursos del SGP y SGR por departamentos y municipios de Colombia.',
    //       route: 'reports-map',
    //       value: '11'
    //     },
    //     {
    //       title: '¿Cómo usar el módulo de presupuesto y recaudo?',
    //       content: 'Este módulo permite consultar y comparar información de presupuesto vigente con el recaudo efectivo, presentando análisis financieros detallados.',
    //       route: 'presupuesto-y-recaudo',
    //       value: '12'
    //     },
    //     {
    //       title: '¿Qué herramientas adicionales están disponibles?',
    //       content: 'En el baúl de herramientas encontrará utilidades adicionales como consulta de variables de distribución, históricos, proyecciones y análisis de eficiencia.',
    //       route: 'tools',
    //       value: '13'
    //     }
    //   ]
    // },
    {
      title: 'Conceptos y Definiciones',
      icon: 'help',
      items: [
        {
          title: '¿Qué son las Instrucciones de Abono a Cuenta (IAC)?',
          content: 'Las IAC son los documentos mediante los cuales se comunica oficialmente a las entidades territoriales el recaudo de regalías y compensaciones que les corresponde, para que puedan ser incorporadas en sus presupuestos.',
          value: '14'
        },
        {
          title: '¿Qué significa "doceava" en el contexto del SGP?',
          content: 'Las doceavas son las doce partes iguales en que se divide el monto anual del SGP para su distribución mensual a las entidades territoriales. Para educación se distribuyen 12 doceavas, para los demás conceptos 11 doceavas más la última doceava del año anterior.',
          value: '15'
        },
        {
          title: '¿Qué es el FONPET?',
          content: 'El Fondo Nacional de Pensiones de las Entidades Territoriales (FONPET) es un fondo destinado a atender el pasivo pensional de las entidades territoriales, financiado con recursos del SGR.',
          value: '16'
        },
        {
          title: '¿Qué son las asignaciones directas del SGR?',
          content: 'Son recursos del SGR que se asignan directamente a las entidades territoriales productoras de recursos naturales no renovables, correspondientes al 20% del total de los ingresos del sistema.',
          value: '17'
        }
      ]
    },
    {
      title: 'Soporte Técnico',
      icon: 'support',
      items: [
        {
          title: '¿Cómo exportar la información consultada?',
          content: 'La mayoría de módulos cuentan con botones de exportación que permiten descargar la información en formato Excel para su análisis posterior.',
          value: '18'
        },
        {
          title: '¿Con qué frecuencia se actualiza la información?',
          content: 'La información del SGP se actualiza mensualmente con cada distribución. La información del SGR se actualiza de acuerdo con los reportes de recaudo y las instrucciones de abono a cuenta.',
          value: '19'
        },
        {
          title: '¿Qué hacer si encuentro inconsistencias en los datos?',
          content: 'Si identifica posibles inconsistencias en la información, puede reportarlas a través del formulario de PQRSD disponible en el sitio web del DNP o contactar directamente al equipo técnico al correo sicodis@dnp.gov.co',
          value: '20'
        },
        {
          title: '¿Hay documentación técnica disponible?',
          content: 'Sí, en la sección "Documentos Financiamiento Territorial" encontrará la documentación técnica, metodológica y normativa relacionada con el SGP y SGR.',
          value: '21'
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
        { label: 'Preguntas Frecuentes' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  navigateToRoute(route: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}