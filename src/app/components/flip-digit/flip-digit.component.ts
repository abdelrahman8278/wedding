import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-flip-digit',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('flip', [
      transition(':increment', [
        style({ transform: 'translateY(25px) rotateX(-90deg)', opacity: 0 }),
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(0) rotateX(0deg)', opacity: 1 })
        ),
      ]),
      transition(':decrement', [
        style({ transform: 'translateY(-25px) rotateX(90deg)', opacity: 0 }),
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(0) rotateX(0deg)', opacity: 1 })
        ),
      ]),
    ]),
  ],
  template: `
    <div
      class="relative flex items-center justify-center overflow-hidden rounded-lg border sm:rounded-xl h-11 w-7 sm:h-[4.5rem] sm:w-12"
      [class]="boxClassName"
    >
      <!-- Center dividing line -->
      <div class="absolute top-1/2 z-20 h-px w-full -translate-y-1/2 bg-black/30"></div>
      <!-- Overlay gradient -->
      <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
      <!-- Animated digit -->
      <span
        [@flip]="value"
        class="relative z-30 font-playfair text-xl font-bold tabular-nums sm:text-4xl"
        [class]="textClassName"
      >{{ value }}</span>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class FlipDigitComponent {
  @Input() value = 0;
  @Input() boxClassName = 'bg-pink-900 border-pink-700/50 shadow-2xl';
  @Input() textClassName = 'text-white';
}
