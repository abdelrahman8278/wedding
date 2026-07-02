import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':slug/messages',
    loadComponent: () =>
      import('./pages/messages/messages.component').then(m => m.MessagesComponent),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/invitation/invitation.component').then(m => m.InvitationComponent),
  },
  { path: '', redirectTo: '/not-found', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' },
];
