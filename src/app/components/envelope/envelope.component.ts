import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { InvitationTemplateId } from '../../lib/templates';

interface EnvelopeStyle {
  back: string;
  side: string;
  bottom: string;
  top: string;
  card: string;
  names: string;
  line: string;
  seal: string;
  sealInner: string;
  sealText: string;
  hint: string;
}

const envelopeStyles: Record<InvitationTemplateId, EnvelopeStyle> = {
  'glassmorphism-luxury': {
    back: 'bg-[#f4e2ff]/48 border-white/60 backdrop-blur-xl shadow-[0_30px_90px_rgba(118,75,162,0.24)]',
    side: 'bg-[#d9b4e3]/82',
    bottom: 'bg-[#f6d7ea]/70 border-[#b98ccf]/55',
    top: 'bg-[linear-gradient(135deg,#e0bbe4,#d291bc,#957dad)] border-white/65',
    card: 'bg-white/60 border-white/75',
    names: 'text-[#3b255c]',
    line: 'bg-[#764ba2]',
    seal: 'bg-[#764ba2] border-[#e0bbe4]',
    sealInner: 'bg-[#d291bc]',
    sealText: 'text-white',
    hint: 'text-[#3b255c]/75',
  },
  'neumorphism-soft': {
    back: 'bg-[#ede4db] border-[#f8f1ea] shadow-[12px_12px_28px_#d1c7bb,-12px_-12px_28px_#ffffff]',
    side: 'bg-[#E8D5C4]',
    bottom: 'bg-[#ede4db] border-[#d1c7bb]',
    top: 'bg-[linear-gradient(135deg,#E8D5C4,#C9B8A8)] border-white/70',
    card: 'bg-[#ede4db] border-[#f8f1ea] shadow-[inset_8px_8px_18px_#d1c7bb,inset_-8px_-8px_18px_#ffffff]',
    names: 'text-[#8f7763]',
    line: 'bg-[#C9B8A8]',
    seal: 'bg-[#C9B8A8] border-white',
    sealInner: 'bg-[#E8D5C4]',
    sealText: 'text-[#6f5b4b]',
    hint: 'text-[#8f7763]',
  },
  'gradient-wave-modern': {
    back: 'bg-white/10 border-[#D4AF37]/50 backdrop-blur-lg shadow-[0_35px_100px_rgba(51,8,103,0.3)]',
    side: 'bg-white/20',
    bottom: 'bg-white/20 border-[#D4AF37]/45',
    top: 'bg-[linear-gradient(135deg,#FA709A,#FEE140,#30CFD0)] border-[#D4AF37]/70',
    card: 'bg-white/15 border-[#D4AF37]/60 backdrop-blur-xl',
    names: 'text-white',
    line: 'bg-[#D4AF37]',
    seal: 'bg-[#D4AF37] border-white/80',
    sealInner: 'bg-[#330867]',
    sealText: 'text-white',
    hint: 'text-white/85',
  },
  'dark-elegant-premium': {
    back: 'bg-[var(--invite-surface)] border-[var(--invite-border)] shadow-[0_35px_95px_var(--invite-shadow)]',
    side: 'bg-[var(--invite-surface-soft)]',
    bottom: 'bg-[var(--invite-bg-soft)] border-[var(--invite-border)]',
    top: 'bg-[linear-gradient(135deg,var(--invite-surface-soft),var(--invite-surface))] border-[var(--invite-border)]',
    card: 'bg-[var(--invite-surface-soft)] border-[var(--invite-border)]',
    names: 'text-[var(--invite-accent)]',
    line: 'bg-[var(--invite-accent)]',
    seal: 'bg-[var(--invite-accent)] border-[var(--invite-accent-soft)]',
    sealInner: 'bg-[var(--invite-surface)]',
    sealText: 'text-[var(--invite-accent)]',
    hint: 'text-[var(--invite-accent)]/80',
  },
  'floral-watercolor': {
    back: 'bg-[#FFFEF9] border-[#FFE5E5] shadow-[0_32px_80px_rgba(186,144,198,0.18)]',
    side: 'bg-[#FFE5E5]',
    bottom: 'bg-[#FFFEF9] border-[#E8A0BF]/40',
    top: 'bg-[linear-gradient(135deg,#FFE5E5,#C8E7ED,#B4E7CE)] border-white/70',
    card: 'bg-white/85 border-[#E8A0BF]/35',
    names: 'text-[#7b4b6a]',
    line: 'bg-[#B4E7CE]',
    seal: 'bg-[#E8A0BF] border-[#FFE5E5]',
    sealInner: 'bg-[#BA90C6]',
    sealText: 'text-white',
    hint: 'text-[#7b4b6a]',
  },
  'botanical-watercolor': {
    back: 'bg-[#fffaf0]/92 border-[#d8c79d]/65 shadow-[0_30px_82px_rgba(82,106,78,0.16)]',
    side: 'bg-[#dbe7d4]',
    bottom: 'bg-[#fffaf0] border-[#d8c79d]/55',
    top: 'bg-[linear-gradient(135deg,#fffaf0,#e7eddc,#f1cbd3)] border-[#d8c79d]/55',
    card: 'bg-[#fffaf0]/90 border-[#d8c79d]/50',
    names: 'text-[#526a4e]',
    line: 'bg-[#b79552]',
    seal: 'bg-[#526a4e] border-[#d8c79d]',
    sealInner: 'bg-[#b79552]',
    sealText: 'text-[#fffaf0]',
    hint: 'text-[#42563f]',
  },
  'pink-photo-floral': {
    back: 'bg-white/86 border-[#f0c6d0]/70 shadow-[0_30px_82px_rgba(174,111,130,0.16)]',
    side: 'bg-[#f8d8df]',
    bottom: 'bg-white/92 border-[#f0c6d0]/65',
    top: 'bg-[linear-gradient(135deg,#ffffff,#f4becb,#d7ddd9)] border-[#f0c6d0]/65',
    card: 'bg-white/86 border-[#f0c6d0]/60',
    names: 'text-[#9b6270]',
    line: 'bg-[#b97788]',
    seal: 'bg-[#b97788] border-[#f0c6d0]',
    sealInner: 'bg-[#f4becb]',
    sealText: 'text-white',
    hint: 'text-[#7b4b58]',
  },
  'burgundy-gold-floral': {
    back: 'bg-[#fffaf4]/92 border-[#d1ad55]/70 shadow-[0_30px_82px_rgba(91,33,48,0.16)]',
    side: 'bg-[#f1e1d7]',
    bottom: 'bg-[#fffaf4] border-[#d1ad55]/60',
    top: 'bg-[linear-gradient(135deg,#fffaf4,#d1ad55,#6a1932)] border-[#d1ad55]/70',
    card: 'bg-[#fffaf4]/90 border-[#d1ad55]/55',
    names: 'text-[#6a1932]',
    line: 'bg-[#d1ad55]',
    seal: 'bg-[#6a1932] border-[#d1ad55]',
    sealInner: 'bg-[#d1ad55]',
    sealText: 'text-[#fff7e8]',
    hint: 'text-[#5b2130]',
  },
  'sage-save-date': {
    back: 'bg-white/92 border-[#c8d4bf]/75 shadow-[0_30px_82px_rgba(78,101,72,0.14)]',
    side: 'bg-[#e2ebdd]',
    bottom: 'bg-white border-[#c8d4bf]/70',
    top: 'bg-[linear-gradient(135deg,#ffffff,#eef4ea,#aac297)] border-[#c8d4bf]/75',
    card: 'bg-white/90 border-[#c8d4bf]/65',
    names: 'text-[#4e6548]',
    line: 'bg-[#8b6d3b]',
    seal: 'bg-[#4e6548] border-[#c8d4bf]',
    sealInner: 'bg-[#8b6d3b]',
    sealText: 'text-white',
    hint: 'text-[#4e6548]',
  },
  'emerald-gold-royal': {
    back: 'bg-[#0f4d38]/95 border-[#d4af37]/65 shadow-[0_30px_90px_rgba(10,51,36,0.35)]',
    side: 'bg-[#154f3a]',
    bottom: 'bg-[#0f4d38] border-[#d4af37]/60',
    top: 'bg-[linear-gradient(135deg,#0f4d38,#154f3a,#0a3324)] border-[#d4af37]/70',
    card: 'bg-[#fffaf0] border-[#d4af37]/50 shadow-inner',
    names: 'text-[#0a3324]',
    line: 'bg-[#d4af37]',
    seal: 'bg-[#d4af37] border-white',
    sealInner: 'bg-[#0a3324]',
    sealText: 'text-[#d4af37]',
    hint: 'text-[#d4af37]',
  },
  'sand-linen-minimal': {
    back: 'bg-[#f5efe6] border-[#cbbfa8] shadow-[0_24px_70px_rgba(84,75,61,0.12)]',
    side: 'bg-[#eae3d5]',
    bottom: 'bg-[#f5efe6] border-[#cbbfa8]/80',
    top: 'bg-[#f5efe6] border-[#cbbfa8]',
    card: 'bg-white border-[#cbbfa8]/60 shadow-sm',
    names: 'text-[#544b3d]',
    line: 'bg-[#a3957e]',
    seal: 'bg-[#544b3d] border-white',
    sealInner: 'bg-[#a3957e]',
    sealText: 'text-white',
    hint: 'text-[#544b3d]/80',
  },
  'midnight-velvet-starry': {
    back: 'bg-[#03001e]/95 border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
    side: 'bg-[#0f0c2f]/80',
    bottom: 'bg-[#03001e] border-white/15',
    top: 'bg-[linear-gradient(135deg,#03001e,#7303c0)] border-white/25',
    card: 'bg-[#0a0524] border-white/20 backdrop-blur-md',
    names: 'text-[#ec38bc]',
    line: 'bg-[#7303c0]',
    seal: 'bg-[linear-gradient(135deg,#7303c0,#ec38bc)] border-white/40',
    sealInner: 'bg-black',
    sealText: 'text-white',
    hint: 'text-[#ec38bc]/90',
  },
  'arabic-blush-story': {
    back: 'bg-white/92 border-[#ead3d6]/80 shadow-[0_30px_82px_rgba(120,95,95,0.13)]',
    side: 'bg-[#fff1f2]',
    bottom: 'bg-white border-[#ead3d6]/75',
    top: 'bg-[linear-gradient(135deg,#ffffff,#fff1f2,#dce9e5)] border-[#ead3d6]/80',
    card: 'bg-white/90 border-[#ead3d6]/70',
    names: 'text-[#5c5955]',
    line: 'bg-[#d69aa4]',
    seal: 'bg-[#6c6862] border-[#ead3d6]',
    sealInner: 'bg-[#d69aa4]',
    sealText: 'text-white',
    hint: 'text-[#5c5955]',
  },
  'geometric-modern': {
    back: 'bg-[#1A535C] border-[#FFE66D] shadow-[0_35px_80px_rgba(26,83,92,0.28)]',
    side: 'bg-[#4ECDC4]',
    bottom: 'bg-[#FF6B6B] border-[#FFE66D]',
    top: 'bg-[linear-gradient(135deg,#FF6B6B,#FFE66D,#4ECDC4)] border-white/60',
    card: 'bg-[#f8fbfa] border-[#1A535C]',
    names: 'text-[#1A535C]',
    line: 'bg-[#FF6B6B]',
    seal: 'bg-[#FFE66D] border-[#1A535C]',
    sealInner: 'bg-[#FF6B6B]',
    sealText: 'text-[#1A535C]',
    hint: 'text-[#1A535C]',
  },
  'animated-particle': {
    back: 'bg-white/80 border-white/80 shadow-[0_35px_95px_rgba(102,126,234,0.28)]',
    side: 'bg-[#FF6B9D]/80',
    bottom: 'bg-white/90 border-[#FFA07A]/50',
    top: 'bg-[linear-gradient(135deg,#FF6B9D,#FFA07A,#FFD93D)] border-white/70',
    card: 'bg-white/95 border-white',
    names: 'text-[#C44569]',
    line: 'bg-[#FFD93D]',
    seal: 'bg-[#C44569] border-[#FFD93D]',
    sealInner: 'bg-[#FF6B9D]',
    sealText: 'text-white',
    hint: 'text-white/85',
  },
  'minimalist-japanese': {
    back: 'bg-white border-black shadow-[0_24px_70px_rgba(0,0,0,0.12)]',
    side: 'bg-white',
    bottom: 'bg-white border-[#E0E0E0]',
    top: 'bg-white border-black',
    card: 'bg-white border-[#E0E0E0]',
    names: 'text-black',
    line: 'bg-[#C9A96E]',
    seal: 'bg-white border-black',
    sealInner: 'bg-[#C9A96E]',
    sealText: 'text-black',
    hint: 'text-black/65',
  },
};

@Component({
  selector: 'app-envelope',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('envelopeEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(30px)' }),
        animate('700ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('600ms cubic-bezier(0.43, 0.13, 0.23, 0.96)',
          style({ opacity: 0, transform: 'scale(1.05) translateY(-120px)', filter: 'blur(3px)' })),
      ]),
    ]),
    trigger('card', [
      state('closed', style({ transform: 'translateY(0) scale(1) rotateZ(0deg)' })),
      state('open', style({ transform: 'translateY(-210px) scale(0.88) rotateZ(-1.5deg)' })),
      transition('closed => open', animate('2600ms 500ms cubic-bezier(0.16, 1, 0.3, 1)')),
    ]),
    trigger('lid', [
      state('closed', style({ transform: 'rotateX(0deg)' })),
      state('open', style({ transform: 'rotateX(172deg)' })),
      transition('closed => open', animate('600ms 50ms cubic-bezier(0.36, 0.07, 0.19, 0.97)')),
    ]),
    trigger('seal', [
      state('visible', style({ transform: 'scale(1) rotate(0deg)', opacity: '1' })),
      state('hidden', style({ transform: 'scale(0) rotate(180deg)', opacity: '0' })),
      transition('visible => hidden', animate('500ms cubic-bezier(0.36, 0, 0.66, -0.56)')),
    ]),
    trigger('hint', [
      state('visible', style({ opacity: '1', transform: 'translateY(0)' })),
      state('hidden', style({ opacity: '0', transform: 'translateY(16px)' })),
      transition('visible => hidden', animate('400ms ease-in')),
    ]),
  ],
  template: `
    <div
      @envelopeEnter
      (click)="handleClick()"
      class="relative cursor-pointer outline-none"
      style="height: 220px; width: 320px; perspective: 2200px;"
      [class.sm\\:h-\\[280px\\]]="true"
      [class.sm\\:w-\\[440px\\]]="true"
      [class.pointer-events-none]="isOpened"
      role="button"
      tabindex="0"
      aria-label="افتح الدعوة"
      (keydown.enter)="handleClick()"
    >
      <!-- Float wrapper -->
      <div
        class="relative w-full h-full"
        [class.animate-float]="!isOpened"
      >
        <!-- Shadow -->
        <div
          class="absolute -bottom-10 left-1/2 h-10 w-[90%] -translate-x-1/2 scale-y-50 rounded-full bg-black/20 blur-2xl transition-all duration-[1200ms]"
          [class.opacity-40]="isOpened"
          [class.scale-x-[0.7]]="isOpened"
          [class.translate-y-[10px]]="isOpened"
        ></div>

        <!-- Envelope back -->
        <div class="absolute inset-0 rounded-2xl border" [class]="style.back"></div>

        <!-- Animated particle decor for animated-particle template -->
        @if (template === 'animated-particle') {
          <div class="absolute inset-0 rounded-2xl animate-float-particles opacity-45 [background-image:radial-gradient(#FFD93D_2px,transparent_2px),radial-gradient(#FF6B9D_2px,transparent_2px)] [background-position:0_0,22px_28px] [background-size:48px_48px]"></div>
        }
        @if (template === 'dark-elegant-premium') {
          <div class="absolute inset-0 opacity-45 [background-image:radial-gradient(var(--invite-accent)_1px,transparent_1px)] [background-size:38px_38px]"></div>
        }
        @if (template === 'floral-watercolor') {
          <div class="absolute -left-6 -top-6 text-6xl text-[#E8A0BF]/45">✿</div>
        }

        <!-- Card inside envelope -->
        <div
          [@card]="isOpened ? 'open' : 'closed'"
          class="absolute inset-[10px] z-[5] flex flex-col items-center justify-center overflow-hidden rounded-xl border shadow-inner sm:inset-[15px]"
          [class]="style.card"
        >
          <span
            class="font-playfair text-3xl sm:text-4xl transition-all duration-[1500ms] delay-[800ms]"
            [class]="style.names"
            [class.scale-110]="isOpened"
          >{{ initials }}</span>
          <div
            class="mt-2 h-0.5 rounded-full transition-all duration-[1500ms] delay-[900ms]"
            [class]="style.line"
            [style.width]="isOpened ? '4rem' : '3rem'"
          ></div>
        </div>

        <!-- Left side flap -->
        <div
          class="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          [class]="style.side"
          style="clip-path: polygon(0 0, 50% 50%, 0 100%)"
        ></div>
        <!-- Right side flap -->
        <div
          class="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          [class]="style.side"
          style="clip-path: polygon(100% 0, 50% 50%, 100% 100%)"
        ></div>

        <!-- Bottom flap -->
        <div
          class="pointer-events-none absolute inset-0 z-20 rounded-2xl border-b shadow-[0_-5px_15px_rgba(0,0,0,0.03)]"
          [class]="style.bottom"
          style="clip-path: polygon(0 100%, 50% 55%, 100% 100%)"
        ></div>

        <!-- Top lid (animated) -->
        <div
          [@lid]="isOpened ? 'open' : 'closed'"
          class="absolute inset-0 z-30 origin-top rounded-2xl border-t shadow-xl"
          [class]="style.top"
          style="clip-path: polygon(0 0, 100% 0, 50% 55%); transform-style: preserve-3d;"
        ></div>

        <!-- Seal -->
        <div
          [@seal]="isOpened ? 'hidden' : 'visible'"
          class="absolute left-1/2 top-[55%] z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-20 sm:w-20"
        >
          <div class="absolute inset-0 rounded-full border-2 shadow-lg animate-seal-pulse" [class]="style.seal"></div>
          <div class="absolute inset-1 rounded-full border border-white/35" [class]="style.sealInner"></div>
          <span class="relative z-10 text-center font-cairo text-[10px] font-bold leading-tight tracking-tight drop-shadow-md sm:text-[11px]" [class]="style.sealText">
            افتح<br/>الدعوة
          </span>
        </div>

        <!-- Hint text -->
        <div
          [@hint]="isOpened ? 'hidden' : 'visible'"
          class="absolute -bottom-16 left-0 w-full text-center"
        >
          <span
            class="font-cairo text-xs font-bold tracking-wide sm:text-sm animate-blink-hint"
            [class]="style.hint"
          >اضغط لفتح الدعوة</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    div[role="button"] {
      height: 220px;
      width: 320px;
    }
    @media (min-width: 640px) {
      div[role="button"] {
        height: 280px;
        width: 440px;
      }
    }
  `],
})
export class EnvelopeComponent {
  @Input() template!: InvitationTemplateId;
  @Input() groom!: string;
  @Input() bride!: string;
  @Output() opened = new EventEmitter<void>();

  isOpened = false;

  get style(): EnvelopeStyle {
    return envelopeStyles[this.template];
  }

  get initials(): string {
    return `${this.groom?.charAt(0) ?? ''} & ${this.bride?.charAt(0) ?? ''}`.toUpperCase();
  }

  handleClick(): void {
    if (this.isOpened) return;
    this.isOpened = true;
    setTimeout(() => this.opened.emit(), 1500);
  }
}
