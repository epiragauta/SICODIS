import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, Output, EventEmitter  } from '@angular/core';


@Component({
  selector: 'app-faq-item',
  standalone: true,
  imports: [],
   templateUrl: './faq-item.component.html',
  styleUrl: './faq-item.component.scss',
  animations: [
    trigger('slideInOut', [
      state('true', style({
        height: '*',
        opacity: 1
      })),
      state('false', style({
        height: '0px',
        opacity: 0
      })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ])
  ]
})
export class FaqItemComponent {

  @Input() item!: FaqItem;
  @Output() toggleAnswer = new EventEmitter<number>();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
    //this.toggleAnswer.emit(this.item.id);
  }
}

export interface FaqItem {
  title: string;
  content: string;
  route?: string;
  value: string;
}
