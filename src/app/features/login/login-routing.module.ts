import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePasswordComponent } from './pages/create-password/create-password.component';
import { EnterCodeComponent } from './pages/enter-code/enter-code.component';
import { EnterPasswordComponent } from './pages/enter-password/enter-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'enter-code', component: EnterCodeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'create-password', component: CreatePasswordComponent },
  { path: 'enter-password', component: EnterPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
