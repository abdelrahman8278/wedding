import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
} from '@angular/animations';
import { EnvelopeComponent } from '../envelope/envelope.component';
import { InvitationCardComponent } from '../invitation-card/invitation-card.component';
import { TemplateSwitcherComponent } from '../template-switcher/template-switcher.component';
import { Invitation } from '../../core/models/types';
import {
  getInvitationTemplateId,
  getInvitationTemplateUi,
  getInvitationThemeMode,
  getInvitationThemeVars,
  InvitationTemplateId,
  InvitationThemeMode,
} from '../../lib/templates';

@Component({
  selector: 'app-invitation-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EnvelopeComponent,
    InvitationCardComponent,
    TemplateSwitcherComponent,
  ],
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        animate('2000ms 0ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({
            opacity: 0,
            transform: 'scale(0.06)',
            transformOrigin: 'center 20%',
            offset: 0,
          }),
          style({
            opacity: 0.7,
            transform: 'scale(0.35)',
            transformOrigin: 'center 20%',
            offset: 0.3,
          }),
          style({
            opacity: 1,
            transform: 'scale(1)',
            transformOrigin: 'center 20%',
            offset: 1,
          }),
        ])),
      ]),
    ]),
    trigger('actionButtonEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('400ms 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <main
      class="min-h-screen flex items-center justify-center relative overflow-hidden px-3 pt-16 pb-28 sm:pb-12 lg:pt-28"
      [class]="ui.pageBackground"
      [attr.data-invitation-mode]="mode"
      [style]="themeVars"
    >
      <app-template-switcher [activeTemplate]="template" [activeMode]="mode" />

      <audio #audioEl loop src="/music.mp3"></audio>

      <!-- Envelope view -->
      @if (!isOpen()) {
        <app-envelope
          [template]="template"
          [groom]="data.groom"
          [bride]="data.bride"
          (opened)="handleOpen()"
        />
      }

      <!-- Invitation card view -->
      @if (isOpen()) {
        <app-invitation-card
          @cardEnter
          [id]="data.id"
          [groom]="data.groom"
          [bride]="data.bride"
          [message]="data.message"
          [date]="data.wedding_date"
          [location_name]="data.location_name"
          [location_city]="data.location_city"
          [template]="template"
        />
      }

      <!-- Guest messages link -->
      <div @actionButtonEnter class="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
        <a
          [routerLink]="['/' + data.slug + '/messages']"
          [queryParams]="{ template: template, mode: mode }"
          class="flex min-h-12 items-center gap-2 rounded-full border px-4 py-3 transition-all duration-300 group sm:px-5 {{ ui.actionButton }}"
          aria-label="رسائل الضيوف"
        >
          <!-- Envelope SVG icon -->
          <svg
            class="text-lg transition-transform duration-300 group-hover:scale-110 {{ ui.actionIcon }}"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span class="font-cairo text-sm font-bold">رسائل الضيوف</span>
        </a>
      </div>

      <!-- Floating Action Buttons (Left Side: WhatsApp + Music) -->
      @if (isOpen()) {
        <div @actionButtonEnter class="fixed bottom-5 left-5 z-[60] flex items-center gap-3 sm:bottom-6 sm:left-6">
          <!-- WhatsApp Button -->
          <a
            href="https://wa.me/201007992310"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 active:scale-90 {{ ui.actionButton }}"
            aria-label="تواصل عبر واتساب"
          >
            <!-- High-fidelity official WhatsApp path SVG colored in official WhatsApp green -->
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
              class="text-[#25D366] transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.763.46 3.483 1.332 5.006L2 22l5.126-1.314a9.92 9.92 0 0 0 4.878 1.31h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm0 1.662c4.6 0 8.334 3.734 8.334 8.334 0 4.6-3.734 8.334-8.334 8.334a8.27 8.27 0 0 1-4.24-1.157l-.304-.18-3.155.81.823-3.08-.198-.316a8.28 8.28 0 0 1-1.284-4.41c0-4.6 3.734-8.334 8.334-8.334zm-1.896 2.766c-.26 0-.53.078-.737.28-.206.2-.767.75-.767 1.83 0 1.08.784 2.122.894 2.27.11.147 1.543 2.355 3.737 3.3.522.226.93.36 1.246.46.524.167 1.002.143 1.38.087.42-.062 1.29-.527 1.472-1.012.183-.484.183-.9.128-.987-.054-.088-.205-.138-.426-.25-.22-.11-1.292-.638-1.49-.71-.2-.072-.344-.11-.49.11-.147.22-.57.712-.7.86-.128.148-.258.165-.478.055-.22-.11-.93-.343-1.772-1.094-.655-.584-1.097-1.306-1.226-1.526-.128-.22-.014-.338.096-.448.1-.1.22-.258.33-.387.11-.13.147-.22.22-.367.073-.147.037-.276-.018-.387-.056-.11-.49-1.18-.67-1.615-.178-.43-.356-.37-.49-.377z"/>
            </svg>
          </a>

          <!-- Music Button -->
          <button
            type="button"
            (click)="toggleAudio()"
            class="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 active:scale-90 {{ ui.actionButton }}"
            [aria-label]="isAudioPlaying() ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'"
          >
            @if (isAudioPlaying()) {
              <!-- Playing Icon -->
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="{{ ui.actionIcon }}"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            } @else {
              <!-- Muted Icon -->
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="{{ ui.actionIcon }}"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z"/>
                <line x1="22" y1="9" x2="16" y2="15"/>
                <line x1="16" y1="9" x2="22" y2="15"/>
              </svg>
            }
          </button>
        </div>
      }
    </main>
  `,
})
export class InvitationViewComponent implements OnInit {
  @Input() data!: Invitation;
  @ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;

  isOpen = signal(false);
  isAudioPlaying = signal(false);
  template: InvitationTemplateId = 'glassmorphism-luxury';
  mode: InvitationThemeMode = 'dark';

  constructor(private route: ActivatedRoute) {}

  get ui() {
    return getInvitationTemplateUi(this.template);
  }

  get themeVars(): Record<string, string> {
    return getInvitationThemeVars(this.mode) as Record<string, string>;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.template = getInvitationTemplateId(
        params['template'] ?? this.data.template ?? this.data.template_id
      );
      this.mode = getInvitationThemeMode(params['mode']);
    });
  }

  handleOpen(): void {
    this.isOpen.set(true);
    const audio = this.audioEl?.nativeElement;
    if (audio) {
      audio.play().then(() => {
        this.isAudioPlaying.set(true);
      }).catch(() => {});
    }
  }

  toggleAudio(): void {
    const audio = this.audioEl?.nativeElement;
    if (!audio) return;

    if (this.isAudioPlaying()) {
      audio.pause();
      this.isAudioPlaying.set(false);
    } else {
      audio.play().then(() => {
        this.isAudioPlaying.set(true);
      }).catch(() => {});
    }
  }
}
