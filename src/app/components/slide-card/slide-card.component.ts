import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { slideCard } from '../../animations/quickview-animation';

@Component({
  selector: 'app-slide-card',
  templateUrl: './slide-card.component.html',
  styleUrls: ['./slide-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideCard()]
})
export class SlideCardComponent {
  @Input() activeCard: string = 'top';

  constructor() { }

}
