import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './pages/create-password/create-password.component';
import { EnterPasswordComponent } from './pages/enter-password/enter-password.component';
import { EnterCodeComponent } from './pages/enter-code/enter-code.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@NgModule({
	declarations: [
		LoginComponent,
		FooterComponent,
		PrivacyComponent,
		TermsComponent,
		ForgotPasswordComponent,
		CreatePasswordComponent,
		EnterPasswordComponent,
		EnterCodeComponent,
		NotFoundComponent
	],
	imports: [
		CommonModule,
		LoginRoutingModule,
		SharedModule,
		SocialLoginModule
	],
	providers: [
		// {
		// 	provide: 'SocialAuthServiceConfig',
		// 	useValue: {
		// 		autoLogin: false,
		// 		providers: [
		// 			{
		// 				id: GoogleLoginProvider.PROVIDER_ID,
		// 				provider: new GoogleLoginProvider('315918590805-rgs7vmpv0qhdgv1d2knhbnjpr1l1tm8i.apps.googleusercontent.com')
		// 			},
		// 			{
		// 				id: MicrosoftLoginProvider.PROVIDER_ID,
		// 				provider: new MicrosoftLoginProvider('83346545-2566-4360-b04f-2e41505234c4', {
		// 					redirect_uri: environment.production ? 'https://thenurturebaby.com/calendar' : 'http://localhost:4200/calendar',
		// 					logout_redirect_uri: environment.production ? 'https://thenurturebaby.com/signup' : 'http://localhost:4200/signup'
		// 				}),
		// 			}
		// 		]
		// 	} as SocialAuthServiceConfig,
		// }
	]
})
export class LoginModule { }
