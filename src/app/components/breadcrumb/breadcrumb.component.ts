import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/', title: 'Inicio' };
  visible = false;

  private sub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.buildBreadcrumb();
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumb());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private buildBreadcrumb() {
    let currentRoute = this.route.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const label = currentRoute.snapshot.data['breadcrumb'] as string | undefined;
    if (label) {
      this.items = [{ label }];
      this.visible = true;
    } else {
      this.items = [];
      this.visible = false;
    }
  }
}
