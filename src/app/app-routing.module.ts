import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { NotFoundComponent } from './features/login/pages/not-found/not-found.component';
import { PrivacyComponent } from './features/login/pages/privacy/privacy.component';
import { TermsComponent } from './features/login/pages/terms/terms.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  {
    path: 'preferences',
    loadChildren: () =>
      import('./features/preferences/preferences.module').then(
        (m) => m.PreferencesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./features/calendar/calendar.module').then(
        (m) => m.CalendarModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'meeting/:meetingId',
    loadChildren: () =>
      import('./features/invitation/invitation.module').then(
        (m) => m.InvitationModule
      ),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
