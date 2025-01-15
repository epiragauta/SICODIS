import { Component } from '@angular/core';
import { FaqItem, FaqItemComponent } from '../faq-item/faq-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FaqItemComponent],
  template: `
    <div class="faq-container">
      <h2 class="faq-title">Preguntas Frecuentes</h2>
      <div class="faq-list">
        <app-faq-item
          *ngFor="let item of faqItems"
          [item]="item"
          (toggleAnswer)="toggleFaq($event)">
        </app-faq-item>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .faq-title {
      color: #1a365d;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2em;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  `]
  /* templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss' */
})
export class FaqComponent {

  faqItems: FaqItem[] = [
    {
      id: 1,
      question: '¿Qué es el Sistema General de Participaciones?',
      answer: '	El Sistema General de Participaciones es el conjunto de recursos que la Nación transfiere por mandato de los artículos 356 y 357 de la Constitución Política (modificados por los Actos Legislativos 01 de 2001 y 04 de 2007), a las entidades territoriales (departamentos, distritos y municipios) para la financiación tanto de los servicios a su cargo, como para cumplir con las competencias asignadas por la Ley 715 de 2001, la Ley 1122 de 2007 y la Ley 1176 de 2007, en especial en educación, salud y agua potable y saneamiento básico. También, se transfiere una parte de estos recursos a los resguardos indígenas, siempre y cuando no se hayan constituido en entidad territorial indígena.'
    },
    {
      id: 2,
      question: '¿Cómo está compuesto el Sistema General de Participaciones?',
      answer: 'El Sistema General de Participaciones está compuesto por un conjunto de cuatro asignaciones especiales (alimentación escolar, municipios ribereños del Río Grande de la Magdalena, resguardos indígenas y Fondo Nacional de Pensiones de las Entidades Territoriales (Fonpet)) y otro integrado por las asignaciones sectoriales (educación, salud, agua potable y saneamiento básico y una participación de propósito general).'
    },
    {
      id: 3,
      question: '¿Todas las asignaciones tienen la misma participación dentro del total de los recursos?',
      answer: 'No, existe una diferencia en cuanto a los porcentajes. La participación de las asignaciones especiales corresponde al 4%, mientras que el monto de las asignaciones sectoriales es de 96%.'
    }
  ];

  toggleFaq(id: number): void {
    console.log(`FAQ ${id} toggled`);
  }
}
