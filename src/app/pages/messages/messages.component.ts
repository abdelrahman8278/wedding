import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
} from '@angular/animations';
import { SupabaseService } from '../../core/services/supabase.service';
import { getInvitationTemplateId, getInvitationTemplateUi } from '../../lib/templates';
import { GuestMessage, Invitation } from '../../core/models/types';
import { InvitationTemplateId } from '../../lib/templates';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('buttonEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('messageList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(80, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <main class="relative min-h-screen overflow-hidden px-4 py-24" [class]="ui.pageBackground">

      <!-- Back link -->
      <div @buttonEnter class="fixed left-5 top-5 z-50 sm:left-6 sm:top-6">
        <a
          [routerLink]="['/' + slug]"
          [queryParams]="{ template: template }"
          class="flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 group"
          [class]="ui.actionButton"
          aria-label="العودة للدعوة"
        >
          <!-- Arrow left SVG -->
          <svg
            class="text-sm transition-transform duration-300 group-hover:-translate-x-1"
            [class]="ui.actionIcon"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
          <span class="font-cairo text-sm font-bold">الدعوة</span>
          <!-- Envelope SVG -->
          <svg
            class="text-sm" [class]="ui.actionIcon"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      </div>

      <!-- Password gate -->
      @if (!allowed()) {
        <section class="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <div
            @fadeIn
            class="w-full max-w-sm rounded-[2rem] border p-7 text-center sm:p-10"
            [class]="ui.formPanel"
          >
            <!-- Lock icon -->
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border" [class]="ui.formInput">
              <svg
                class="text-2xl" [class]="ui.actionIcon"
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <p class="mb-2 font-cairo text-xs font-bold" [class]="ui.formTitle">منطقة خاصة</p>
            <h1 class="mb-6 font-cairo text-2xl font-bold" [class]="ui.countdownText">رسائل الضيوف</h1>

            <div class="space-y-3">
              <input
                dir="rtl"
                type="password"
                placeholder="كلمة المرور"
                [(ngModel)]="password"
                (ngModelChange)="error.set(false)"
                (keydown.enter)="checkPassword()"
                class="w-full rounded-2xl border px-5 py-3 font-cairo text-sm outline-none transition focus:ring-2"
                [class]="ui.formInput"
              />

              @if (error()) {
                <p @fadeSlide class="font-cairo text-sm text-rose-400">
                  كلمة المرور غير صحيحة
                </p>
              }

              <button
                type="button"
                (click)="checkPassword()"
                [disabled]="loading() || !password.trim()"
                class="min-h-12 w-full rounded-2xl py-3 font-cairo text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] hover:scale-[1.01]"
                [class]="ui.formButton"
              >
                {{ loading() ? 'جار الدخول...' : 'دخول' }}
              </button>
            </div>
          </div>
        </section>
      }

      <!-- Messages list -->
      @if (allowed()) {
        <section class="mx-auto max-w-2xl">
          <div @fadeIn class="mb-12 text-center">
            <p class="mb-2 font-cairo text-xs font-bold" [class]="ui.formTitle">رسائل الضيوف</p>
            <h1 class="font-cairo text-4xl font-bold" [class]="ui.countdownText">كلمات من القلب</h1>
            <div class="mt-4 flex items-center justify-center gap-3">
              <div class="h-px w-16" [class]="ui.formLine"></div>
              <div class="h-1.5 w-1.5 rounded-full" [class]="ui.formLine"></div>
              <div class="h-px w-16" [class]="ui.formLine"></div>
            </div>
          </div>

          @if (messages().length === 0) {
            <div @fadeIn class="py-20 text-center font-cairo text-lg" [class]="ui.formTitle">
              لا توجد رسائل بعد
            </div>
          } @else {
            <div [@messageList]="messages().length" class="space-y-4">
              @for (msg of messages(); track msg.id) {
                <article
                  class="rounded-3xl border p-6"
                  [class]="ui.formPanel"
                  dir="rtl"
                >
                  <div class="mb-3 flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full border font-cairo text-lg font-bold" [class]="ui.formInput">
                      {{ msg.name.charAt(0) }}
                    </div>
                    <h3 class="font-cairo text-sm font-bold" [class]="ui.countdownText">{{ msg.name }}</h3>
                  </div>
                  <p class="font-cairo text-sm leading-relaxed" [class]="ui.countdownText">{{ msg.message }}</p>
                </article>
              }
            </div>
          }
        </section>
      }
    </main>
  `,
})
export class MessagesComponent implements OnInit {
  slug = '';
  template: InvitationTemplateId = 'glassmorphism-luxury';

  password = '';
  messages = signal<GuestMessage[]>([]);
  allowed = signal(false);
  loading = signal(false);
  error = signal(false);

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
  ) {}

  get ui() {
    return getInvitationTemplateUi(this.template);
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.template = getInvitationTemplateId(
      this.route.snapshot.queryParamMap.get('template')
    );
  }

  async checkPassword(): Promise<void> {
    if (!this.password.trim()) return;
    this.loading.set(true);
    this.error.set(false);

    const { data } = await this.supabase.client
      .from('invitations')
      .select('*')
      .eq('slug', this.slug)
      .single<Invitation>();

    if (data?.access_password === this.password) {
      const { data: msgs } = await this.supabase.client
        .from('guest_messages')
        .select('*')
        .eq('invitation_id', data.id)
        .order('created_at', { ascending: false })
        .returns<GuestMessage[]>();

      this.messages.set(msgs || []);
      this.allowed.set(true);
    } else {
      this.error.set(true);
    }

    this.loading.set(false);
  }
}
