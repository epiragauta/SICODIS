import { Component } from '@angular/core';
import { ReportsTargetComponent } from '../reports-target/reports-target.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReportsTargetComponent, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  reports: any = [
    {
      roteImg:'/assets/img/target2.svg',
      date:'Junio 3 de 2024',
      title:'Informe del Sistema General de Regalías'
    },
    {
      roteImg:'/assets/img/target1.svg',
      date:'Junio 3 de 2024',
      title:'Informe del Sistema General de Regalías'
    },
    {
      roteImg:'/assets/img/target2.svg',
      date:'Junio 3 de 2024',
      title:'Informe del Sistema General de Regalías'
    },
    {
      roteImg:'/assets/img/target2.svg',
      date:'Junio 3 de 2024',
      title:'Informe del Sistema General de Regalías'
    }
  ];

  constructor(
    private route: Router,
  ){}

  redirectSGR(){
    this.route.navigate(['/reports-sgr']);
  }

}
