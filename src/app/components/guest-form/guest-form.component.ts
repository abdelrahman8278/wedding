import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { SupabaseService } from '../../core/services/supabase.service';
import { getInvitationTemplateUi, InvitationTemplateId } from '../../lib/templates';

@Component({
  selector: 'app-guest-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' })),
      ]),
    ]),
  ],
  template: `
    <div class="mt-10 w-full">
      <!-- Section title -->
      <div class="mb-6 flex items-center gap-4">
        <div class="h-px flex-1" [class]="ui.formLine"></div>
        <p class="font-cairo text-xs font-bold" [class]="ui.formTitle">رسالتك لنا</p>
        <div class="h-px flex-1" [class]="ui.formLine"></div>
      </div>

      <!-- Form panel -->
      <div class="space-y-4 rounded-3xl border p-5 sm:p-6" [class]="ui.formPanel">
        <!-- Name input -->
        <label class="block">
          <span class="sr-only">اسمك</span>
          <input
            dir="rtl"
            placeholder="اسمك"
            [(ngModel)]="name"
            (ngModelChange)="error.set('')"
            class="w-full rounded-2xl border px-5 py-3 font-cairo text-sm outline-none transition focus:ring-2"
            [class]="ui.formInput"
          />
        </label>

        <!-- Message textarea -->
        <label class="block">
          <span class="sr-only">رسالتك للعروسين</span>
          <textarea
            dir="rtl"
            rows="4"
            placeholder="رسالتك للعروسين..."
            [(ngModel)]="message"
            (ngModelChange)="error.set('')"
            class="w-full resize-none rounded-2xl border px-5 py-3 font-cairo text-sm outline-none transition focus:ring-2"
            [class]="ui.formInput"
          ></textarea>
        </label>

        <!-- Submit button -->
        <button
          type="button"
          (click)="handleSubmit()"
          [disabled]="loading() || !name.trim() || !message.trim()"
          class="min-h-12 w-full rounded-2xl py-3 font-cairo text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] hover:scale-[1.01]"
          [class]="ui.formButton"
        >
          {{ loading() ? 'جار الإرسال...' : 'إرسال الرسالة' }}
        </button>

        <!-- Error message -->
        @if (error()) {
          <div @fadeSlide class="pt-1 text-center font-cairo text-sm text-rose-400">
            {{ error() }}
          </div>
        }

        <!-- Success message -->
        @if (sent()) {
          <div @fadeSlide class="pt-1 text-center font-cairo text-sm" [class]="ui.formSuccess">
            تم إرسال رسالتك بنجاح ✓
          </div>
        }
      </div>
    </div>
  `,
})
export class GuestFormComponent {
  @Input() invitationId!: string;
  @Input() template!: InvitationTemplateId;

  name = '';
  message = '';
  loading = signal(false);
  sent = signal(false);
  error = signal('');

  constructor(private supabase: SupabaseService) {}

  get ui() {
    return getInvitationTemplateUi(this.template);
  }

  async handleSubmit(): Promise<void> {
    const trimmedName = this.name.trim();
    const trimmedMessage = this.message.trim();

    if (!trimmedName || !trimmedMessage) {
      this.error.set('اكتب اسمك ورسالتك قبل الإرسال');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { error: submitError } = await this.supabase.client
      .from('guest_messages')
      .insert([{ invitation_id: this.invitationId, name: trimmedName, message: trimmedMessage }]);

    this.loading.set(false);

    if (submitError) {
      this.error.set('حدث خطأ أثناء الإرسال، حاول مرة أخرى');
      return;
    }

    this.sent.set(true);
    this.name = '';
    this.message = '';

    setTimeout(() => this.sent.set(false), 4000);
  }
}
