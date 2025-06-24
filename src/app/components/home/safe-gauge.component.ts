import { Component, Input, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-safe-gauge',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  template: `
    <div class="gauge-wrapper" [style.opacity]="isReady ? 1 : 0">
      <ngx-gauge
        *ngIf="isReady && isBrowser"
        #gaugeRef
        [value]="value"
        [max]="max"
        [min]="min"
        [thick]="thick"
        [label]="label"
        [append]="append"
        [foregroundColor]="foregroundColor"
        [backgroundColor]="backgroundColor"
        [size]="size"
        [duration]="duration">
      </ngx-gauge>
      
      <!-- Fallback para SSR o mientras se carga -->
      <div *ngIf="!isReady || !isBrowser" class="gauge-fallback" [style.width.px]="size" [style.height.px]="size">
        <div class="fallback-content">
          <div class="fallback-value">{{ value }}{{ append }}</div>
          <div class="fallback-label">{{ label }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gauge-wrapper {
      transition: opacity 0.3s ease-in-out;
    }
    
    .gauge-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #e5e7eb;
      border-radius: 50%;
      background: #f9fafb;
      margin: 0 auto;
    }
    
    .fallback-content {
      text-align: center;
    }
    
    .fallback-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #374151;
    }
    
    .fallback-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 4px;
    }
  `]
})
export class SafeGaugeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gaugeRef') gaugeRef?: ElementRef;

  @Input() value: number = 0;
  @Input() max: number = 100;
  @Input() min: number = 0;
  @Input() thick: number = 6;
  @Input() type: string = 'arch';
  @Input() label: string = '';
  @Input() append: string = '';
  @Input() foregroundColor: string = '#3b82f6';
  @Input() backgroundColor: string = '#e5e7eb';
  @Input() size: number = 200;
  @Input() duration: number = 1200;

  isBrowser: boolean = false;
  isReady: boolean = false;
  private initTimeout?: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Dar tiempo para que el DOM se estabilice
      this.initTimeout = window.setTimeout(() => {
        try {
          this.isReady = true;
        } catch (error) {
          console.warn('Error initializing gauge:', error);
          // Mantener fallback si hay error
        }
      }, 150);
    }
  }

  ngOnDestroy(): void {
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
    }
  }
}