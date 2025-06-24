import { Component } from '@angular/core';
import { ReportsTargetComponent } from '../reports-target/reports-target.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { Card, CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MatIconModule } from '@angular/material/icon';
// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReportsTargetComponent,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    MatIconModule,
    CarouselModule,
    TagModule,
    NumberFormatPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  cards: MyCard[] = [
    {
      imageUrl: '/assets/img/target2.svg',
      date: 'Junio 3 de 2024',
      description: 'Junio 3 de 2024',
      title: 'Informe del Sistema General de Regalías',
      buttonLabel: 'Ver Reportes'
    },
    {
      imageUrl: '/assets/img/target1.svg',
      date: 'Junio 3 de 2024',
      description: 'Junio 3 de 2024',
      title: 'Informe del Sistema General de Participación',
      buttonLabel: 'Ver Reportes'
    },
    {
      imageUrl: '/assets/img/target2.svg',
      date: 'Junio 3 de 2024',
      description: 'Junio 3 de 2024',
      title: 'Informe del Sistema General de Regalías',
      buttonLabel: 'Ver Reportes'
    },
    {
      imageUrl: '/assets/img/target1.svg',
      date: 'Junio 3 de 2024',
      description: 'Junio 3 de 2024',
      title: 'Informe del Sistema General de Participación',
      buttonLabel: 'Ver Reportes'
    },
  ];

  highlightApps = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Aplicativo ABC',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/boletin-conpes-dnp.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Aplicativo XYZ',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/boletin-dh.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'OUTOFSTOCK',
        rating: 4
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Aplicativo 123',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/comunales.jpg',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
    },
    {
        id: '1003',
        code: '244wgerg2',
        name: 'Aplicativo QWE',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/boletin-mercado-popular.jpg',
        price: 29,
        category: 'Clothing',
        quantity: 25,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1004',
        code: 'h456wer53',
        name: 'Aplicativo ASD',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/Bolet%C3%ADn-Director%20firmando%20acuerdo%20en%20Cali.jpeg',
        price: 15,
        category: 'Accessories',
        quantity: 73,
        inventoryStatus: 'INSTOCK',
        rating: 4
    },
    {
        id: '1005',
        code: 'av2231fwg',
        name: 'Aplicativo ZXC',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/Imagen%20de%20vendedores%20de%20corabastos%20con%20sus%20mercados.jpg',
        price: 120,
        category: 'Accessories',
        quantity: 0,
        inventoryStatus: 'OUTOFSTOCK',
        rating: 4
    },
    {
        id: '1006',
        code: 'bib36pfvm',
        name: 'Aplicativo POI',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/director-dnp.jpg',
        price: 32,
        category: 'Accessories',
        quantity: 5,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
    },
    {
        id: '1007',
        code: 'mbvjkgip5',
        name: 'Aplicativo MNB',
        description: 'Product Description',
        image: 'https://colaboracion.dnp.gov.co/CDT/PublishingImages/Noticias/2024/Diciembre/Cuarta%20Sesi%C3%B3n%20Ordinaria%20del%20Consejo%20del%20Mecanismo%20Especial%20de%20Seguimiento%20de%20Pol%C3%ADticas%20P%C3%BAblicas.jpeg',
        price: 34,
        category: 'Accessories',
        quantity: 23,
        inventoryStatus: 'INSTOCK',
        rating: 5
    }
  ];

  cards2: MyCard[] = [
    {
      title: 'Servicios Profesionales',
      description: 'Ofrecemos servicios de alta calidad adaptados a sus necesidades específicas. Nuestro equipo de expertos está listo para ayudarte.',
      imageUrl: '/assets/img/target2.svg',
      date: 'Junio 3 de 2024',
      buttonLabel: 'Ver Reportes'
    },
    {
      title: 'Productos Innovadores',
      description: 'Descubre nuestra línea de productos innovadores diseñados para mejorar tu vida diaria. Calidad y tecnología de vanguardia.',
      imageUrl: '/assets/img/target1.svg',
      date: 'Junio 3 de 2024',
      buttonLabel: 'Explorar Más'
    },
    {
      title: 'Nuestro Equipo',
      description: 'Conoce al equipo de profesionales detrás de nuestro éxito. Personas apasionadas y comprometidas con la excelencia.',
      imageUrl: '/assets/img/target2.svg',
      date: 'Junio 3 de 2024',
      buttonLabel: 'Conocer Equipo'
    },
    {
      title: 'Contacto',
      description: 'Estamos aquí para responder tus preguntas. Contáctanos y descubre cómo podemos ayudarte a alcanzar tus objetivos.',
      imageUrl: '/assets/img/target1.svg',
      date: 'Junio 3 de 2024',
      buttonLabel: 'Contactar'
    }
  ];

  titleSGR = 'Sistema General de Regalías - SGR';
  titleSGP = 'Sistema General de Participaciones - SGP';

  descriptionSGP =
    'Es el conjunto de recursos que la Nación transfiere a las entidades territoriales para la financiación de servicios a su cargo, como para cumplir con las competencias asignadas  en educación, salud ...';

  descriptionSGR =
    'Es el conjunto de ingresos, asignaciones, órganos, procedimientos y regulaciones, para el uso eficiente y la destinación de los ingresos provenientes de la explotación de los recursos naturales no renovables.';

  responsiveOptions: any[] | undefined;

  cols: number = 4;
  cols2: number = 2;

  // Add to the component class
  departments = [
    { id: 1, name: 'Antioquia' },
    { id: 2, name: 'Cundinamarca' },
    { id: 3, name: 'Santander' },
    // Add more departments as needed
  ];

  municipalities = [
    { id: 1, name: 'Medellín', deptId: 1 },
    { id: 2, name: 'Bogotá', deptId: 2 },
    { id: 3, name: 'Bucaramanga', deptId: 3 },
    // Add more municipalities as needed
  ];

  selectedDepartment: number | null = null;

  sgpItems = [
    { concept: 'Educación', amount: 1000000000, isTotal: false },
    { concept: 'Salud', amount: 800000000, isTotal: false },
    { concept: 'Agua Potable', amount: 500000000, isTotal: false },
    { concept: 'Propósito General', amount: 700000000, isTotal: false },
    { concept: 'Alimentación Escolar', amount: 300000000, isTotal: false },
    { concept: 'Ribereños', amount: 200000000, isTotal: false },
    { concept: 'Resguardos Indígenas', amount: 150000000, isTotal: false },
    { concept: 'Fonpet Asignaciones Especiales', amount: 100000000, isTotal: false },
    { concept: 'Primera Infancia', amount: 250000000, isTotal: false },
    { concept: 'Total SGP', amount: 4000000000, isTotal: true }
  ];

  sgrItems = [
    { concept: 'Total Inversión', amount: 2000000000, isFirst: true, isTotal: false },
    { concept: 'Asignaciones Directas', amount: 500000000, isFirst: false, isTotal: false },
    { concept: 'Asignación para la Inversión Regional', amount: 400000000, isFirst: false, isTotal: false },
    { concept: 'Asignación para la Inversión Local', amount: 300000000, isFirst: false, isTotal: false },
    { concept: 'Asignación para Ciencia, Tecnología e Innovación', amount: 200000000, isFirst: false, isTotal: false },
    { concept: 'Asignación para la Paz', amount: 150000000, isFirst: false, isTotal: false },
    { concept: 'Asignación Ambiental', amount: 100000000, isFirst: false, isTotal: false },
    { concept: 'Municipios Río Magdalena y Canal Dique', amount: 50000000, isFirst: false, isTotal: false },
    { concept: 'Total Ahorro', amount: 3700000000, isFirst: false, isTotal: true }
  ];

  adminSgrItems = [
    { concept: 'Funcionamiento', amount: 2000000000, isFirst: true, isTotal: false },
    { concept: 'Fiscalización', amount: 500000000, isFirst: false, isTotal: false },
    { concept: 'Sistema de Seguimiento Evaluación y Control (SSEC)', amount: 400000000, isFirst: false, isTotal: false },
    { concept: 'Total Administración', amount: 300000000, isFirst: false, isTotal: true },
  ]

  constructor(private route: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 3;
        }
        return 4;
      })
    ).subscribe(cols => this.cols = cols);

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 2;
        }
        return 2;
      })
    ).subscribe(cols2 => this.cols2 = cols2);
  }

  ngOnInit() {


  this.responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ]

    
  }

  redirectSGR() {
    this.route.navigate(['/reports-sgr']);
  }

  redirectSGP() {
    this.route.navigate(['/reports-sgp']);
  }

  redirectTo(page: string){
    this.route.navigate([`/${page}`]);
  }
}

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

export interface MyCard {
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  date: string;
}
