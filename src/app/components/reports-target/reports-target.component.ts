import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-target',
  standalone: true,
  imports: [],
  templateUrl: './reports-target.component.html',
  styleUrl: './reports-target.component.scss'
})
export class ReportsTargetComponent implements OnInit{
  @Input() reports: any;
  routeImg: string = '';
  date: string = '';
  title: string = '';
  constructor(){}

  ngOnInit(): void {
    this.routeImg = this.reports.roteImg;
    this.date = this.reports.date;
    this.title = this.reports.title;
  }
}
