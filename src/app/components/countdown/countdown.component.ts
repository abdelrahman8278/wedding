import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipDigitComponent } from '../flip-digit/flip-digit.component';
import { getInvitationTemplateUi, InvitationTemplateId } from '../../lib/templates';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const total = targetDate.getTime() - new Date().getTime();
  return {
    days: Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((total / 1000 / 60) % 60)),
    seconds: Math.max(0, Math.floor((total / 1000) % 60)),
  };
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FlipDigitComponent],
  template: `
    <div class="my-10 flex flex-col items-center gap-6" [class]="ui.countdownText">
      <h2 class="max-w-full text-center font-cairo text-xl font-bold leading-relaxed sm:text-2xl">
        باقي على يومنا الجميل
      </h2>

      <div class="grid w-full max-w-[34rem] grid-cols-4 gap-2 sm:gap-5">
        <div class="flex min-w-0 flex-col items-center gap-2">
          <div class="flex gap-1">
            <app-flip-digit [value]="digits(time.days, 0)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
            <app-flip-digit [value]="digits(time.days, 1)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
          </div>
          <span class="font-cairo text-[11px] font-bold leading-none opacity-70 sm:text-sm">يوم</span>
        </div>
        <div class="flex min-w-0 flex-col items-center gap-2">
          <div class="flex gap-1">
            <app-flip-digit [value]="digits(time.hours, 0)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
            <app-flip-digit [value]="digits(time.hours, 1)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
          </div>
          <span class="font-cairo text-[11px] font-bold leading-none opacity-70 sm:text-sm">ساعة</span>
        </div>
        <div class="flex min-w-0 flex-col items-center gap-2">
          <div class="flex gap-1">
            <app-flip-digit [value]="digits(time.minutes, 0)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
            <app-flip-digit [value]="digits(time.minutes, 1)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
          </div>
          <span class="font-cairo text-[11px] font-bold leading-none opacity-70 sm:text-sm">دقيقة</span>
        </div>
        <div class="flex min-w-0 flex-col items-center gap-2">
          <div class="flex gap-1">
            <app-flip-digit [value]="digits(time.seconds, 0)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
            <app-flip-digit [value]="digits(time.seconds, 1)" [boxClassName]="ui.digitBox" [textClassName]="ui.digitText" />
          </div>
          <span class="font-cairo text-[11px] font-bold leading-none opacity-70 sm:text-sm">ثانية</span>
        </div>
      </div>
    </div>
  `,
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() date?: string;
  @Input() template!: InvitationTemplateId;

  time: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private timer?: ReturnType<typeof setInterval>;

  get ui() {
    return getInvitationTemplateUi(this.template);
  }

  get targetDate(): Date {
    return this.date ? new Date(this.date) : new Date('2026-12-31T18:00:00');
  }

  digits(value: number, index: number): number {
    return Number(String(value).padStart(2, '0')[index]);
  }

  ngOnInit(): void {
    this.time = getTimeLeft(this.targetDate);
    this.timer = setInterval(() => {
      this.time = getTimeLeft(this.targetDate);
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
