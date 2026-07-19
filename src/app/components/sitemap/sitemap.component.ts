import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sitemap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss'
})
export class SitemapComponent {}
