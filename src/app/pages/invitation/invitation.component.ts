import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvitationViewComponent } from '../../components/invitation-view/invitation-view.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { Invitation } from '../../core/models/types';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, InvitationViewComponent],
  template: `
    @if (loading()) {
      <div class="min-h-screen flex items-center justify-center bg-neutral-950">
        <div class="flex flex-col items-center gap-4">
          <div class="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          <p class="font-cairo text-white/50 text-sm">جاري التحميل...</p>
        </div>
      </div>
    }

    @if (!loading() && notFound()) {
      <div class="min-h-screen flex items-center justify-center bg-neutral-950">
        <div class="text-center">
          <p class="font-cairo text-white/60 text-xl mb-2">الدعوة غير موجودة</p>
          <p class="font-cairo text-white/30 text-sm">تأكد من الرابط وحاول مجدداً</p>
        </div>
      </div>
    }

    @if (!loading() && invitation()) {
      <app-invitation-view [data]="invitation()!" />
    }
  `,
})
export class InvitationComponent implements OnInit {
  invitation = signal<Invitation | null>(null);
  notFound = signal(false);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
  ) {}

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    console.log('InvitationComponent: Fetching invitation for slug:', slug);

    try {
      const { data, error } = await this.supabase.client
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single<Invitation>();

      console.log('InvitationComponent: Supabase response:', { data, error });

      if (error || !data) {
        this.notFound.set(true);
        console.error('InvitationComponent: Invitation not found or error occurred:', error);
      } else {
        this.invitation.set(data);
        console.log('InvitationComponent: Invitation loaded successfully:', data);
      }
    } catch (err) {
      this.notFound.set(true);
      console.error('InvitationComponent: Unexpected error during fetch:', err);
    } finally {
      this.loading.set(false);
      console.log('InvitationComponent: Fetch complete. loading =', this.loading());
    }
  }
}
