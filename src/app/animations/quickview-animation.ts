import { animate, state, style, transition, trigger } from '@angular/animations';

export function slideCard() {
  return trigger('slide', [
    state('top', style({
      transform: 'translateX(0)'
    })),
    state('cat', style({
      transform: 'translateX(-50%)'
    })),
    transition('* => *', animate(250))
  ]);
}
