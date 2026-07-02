import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import {
  getInvitationTemplateUi,
  invitationTemplates,
  InvitationTemplateId,
} from '../../lib/templates';

@Component({
  selector: 'app-template-switcher',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('sidebarSlide', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('backdropFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('220ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('iconSwap', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotate(90deg) scale(0.5)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'rotate(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'rotate(-90deg) scale(0.5)' })),
      ]),
    ]),
    trigger('slideItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-16px)' }),
        animate('250ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <!-- ══════════════════════════════════════════
         DESKTOP (lg+): Horizontal top bar
    ══════════════════════════════════════════ -->
    <div class="fixed left-1/2 top-4 z-[80] hidden w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 lg:block">
      <div
        class="scrollbar-none flex gap-2 overflow-x-auto rounded-2xl border p-2 backdrop-blur-2xl"
        [class]="ui.switcher"
      >
        @for (tmpl of templates; track tmpl.id) {
          <button
            type="button"
            (click)="selectTemplate(tmpl.id)"
            [disabled]="isLoading()"
            [title]="tmpl.description"
            class="min-h-9 shrink-0 rounded-xl px-3.5 py-2.5 font-montserrat text-xs font-bold transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
            [class]="[tmpl.id === activeTemplate ? ui.switcherActive + ' scale-[1.06] shadow-lg border-current/20' : ui.switcherIdle, isLoading() ? 'cursor-wait' : '']"
          >
            <span class="relative inline-flex min-w-12 flex-col items-center justify-center gap-1">
              <span class="inline-flex items-center gap-1.5">
                @if (pendingTemplate() === tmpl.id) {
                  <span class="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                }
                {{ tmpl.shortName }}
              </span>
              <!-- Premium indicator dot under active template -->
              @if (tmpl.id === activeTemplate) {
                <span class="absolute -bottom-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-90 shadow-sm animate-pulse"></span>
              }
            </span>
          </button>
        }
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MOBILE / TABLET (<lg): Sidebar drawer
    ══════════════════════════════════════════ -->

    <!-- Toggle Button -->
    <button
      type="button"
      (click)="isOpen.set(!isOpen())"
      [attr.aria-expanded]="isOpen()"
      aria-label="قائمة التصاميم"
      class="fixed left-4 top-4 z-[90] flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-2xl shadow-xl transition-all duration-300 hover:scale-[1.08] active:scale-[0.88] lg:hidden"
      [class]="ui.switcher"
    >
      @if (isOpen()) {
        <span @iconSwap key="x" class="text-base font-bold leading-none">✕</span>
      } @else {
        <span @iconSwap key="palette" class="text-base leading-none">🎨</span>
      }
    </button>

    <!-- Backdrop -->
    @if (isOpen()) {
      <div
        @backdropFade
        class="fixed inset-0 z-[80] bg-black/25 backdrop-blur-[2px] lg:hidden"
        (click)="isOpen.set(false)"
        aria-hidden="true"
      ></div>
    }

    <!-- Sidebar Panel -->
    @if (isOpen()) {
      <nav
        @sidebarSlide
        class="fixed left-0 top-0 z-[85] flex h-full w-64 flex-col border-r shadow-2xl backdrop-blur-2xl lg:hidden"
        [class]="ui.switcher"
        aria-label="قائمة التصاميم"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 border-b border-current/10 px-5 pb-4 pt-20">
          <span class="shrink-0 text-sm opacity-60">🎨</span>
          <p class="font-cairo text-xs font-bold tracking-wider opacity-60">التصاميم المتاحة</p>
        </div>

        <!-- Template list -->
        <div class="flex flex-col gap-1 overflow-y-auto scrollbar-none px-3 py-3">
          @for (tmpl of templates; track tmpl.id) {
            <button
              @slideItem
              type="button"
              (click)="selectTemplate(tmpl.id)"
              [disabled]="isLoading()"
              class="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-cairo font-bold transition-all duration-300 hover:translate-x-1 active:scale-[0.98]"
              [class]="[tmpl.id === activeTemplate ? ui.switcherActive : ui.switcherIdle, isLoading() && tmpl.id !== activeTemplate ? 'cursor-wait opacity-70' : '']"
            >
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-full bg-current transition-all duration-300"
                [class]="tmpl.id === activeTemplate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
              ></span>
              <span class="flex-1 text-start text-sm font-bold leading-tight">{{ tmpl.name }}</span>
              @if (pendingTemplate() === tmpl.id) {
                <span class="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              } @else {
                <span class="font-montserrat text-[10px] opacity-40 transition-opacity group-hover:opacity-70"
                  [class]="tmpl.id === activeTemplate ? '!opacity-60' : ''"
                >{{ tmpl.shortName }}</span>
              }
            </button>
          }
        </div>

        <!-- Footer -->
        <div class="mt-auto border-t border-current/10 px-5 py-4">
          <p class="font-cairo text-[10px] leading-relaxed opacity-40">اختر تصميم الدعوة المناسب</p>
        </div>
      </nav>
    }
  `,
})
export class TemplateSwitcherComponent implements OnInit, OnDestroy {
  @Input() activeTemplate!: InvitationTemplateId;
  @Input() activeMode?: string;

  readonly templates = invitationTemplates;
  isOpen = signal(true);
  isLoading = signal(false);
  pendingTemplate = signal<InvitationTemplateId | null>(null);

  private keyListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.isOpen.set(false);
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  get ui() {
    return getInvitationTemplateUi(this.activeTemplate);
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keyListener);
  }

  selectTemplate(template: InvitationTemplateId): void {
    if (template === this.activeTemplate || this.isLoading()) return;

    this.isLoading.set(true);
    this.pendingTemplate.set(template);
    this.isOpen.set(false);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { template },
      queryParamsHandling: 'merge',
    }).then(() => {
      setTimeout(() => {
        this.isLoading.set(false);
        this.pendingTemplate.set(null);
      }, 250);
    });
  }
}
