import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { E_signinType } from '@core/enums/enums';
import { AuthService } from '@core/services/auth.service';
import { GoogleService } from '@core/services/google.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { MyErrorStateMatcher, MyErrorStateMatcher2 } from '@core/utils/errormatcher';
import { GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	public loginForm: FormGroup;
	errorMatcher = new MyErrorStateMatcher();
	viewState: string = 'login';

	//user!: SocialUser;
	googleUser!: gapi.auth2.GoogleUser;

	constructor(
		private fb: FormBuilder,
		// private lsService: LocalStorageService,
		private router: Router,
		private dialogService: DialogService,
		//private socialAuthService: SocialAuthService,
		private authService: AuthService,
		private googleService: GoogleService,
		private cdRef: ChangeDetectorRef,
		private ngZone: NgZone,
		private localStorageService: LocalStorageService
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]]
		});
	}
	get glf() { return this.loginForm.controls; }

	ngOnInit(): void {
		let t = this.localStorageService.getTemp();
		if (t && t.fromPage && t.fromPage == 'create-password') this.viewState = 'signup';
		this.decodeURL();

		this.googleService.getGoogleUserAsObservable().subscribe(user => {
			this.ngZone.run(() => {
				if (this.dialogService.isWaiting) return;
				this.dialogService.showWait({ title: "", msg: "Signing in..." });
				this.googleUser = user;
				this.localStorageService.storeLocal(LocalKey.googleAPITokens, this.googleUser.getAuthResponse());
				let signinData = this.googleService.getSigninData(user);
				if (this.googleService.isValidGoogleSignIn(signinData)) {
					this.authService.startSocialLogin({ signinType: E_signinType.google, signinData })
						.then((r) => {
							this.ngZone.run(() => {
								this.dialogService.closeWait();

								if (!r.user.preferences) this.router.navigate(['preferences/1']);
								else this.router.navigate(['home']);
								//this.googleService.getCalendarList(this.googleUser);
							})
						}).catch(e => this.onLoginFail());
				} else this.onLoginFail();
			})
		}, e => this.onLoginFail("Something went wrong. Do contact support if this persists!"));
	}
	decodeURL() {
		const url = this.router.url;
		let paramStr = url.split('?')[1];
		const t = new URLSearchParams(paramStr);
		if (t.has('signup') && t.get('signup') == '1') this.viewState = 'signup';
	}
	onLoginFail(msg = "Login attempt via Google failed. Please try again!"): void {
		this.dialogService.closeWait();
		this.dialogService.openDialog({ title: "Oops!", msg });
	}

	startLogin(): void {
		console.log('startLogin', this.loginForm.value);
		this.localStorageService.storeTemp(this.loginForm.value);
		if (this.viewState == 'login') {
			this.router.navigate(['login/enter-password']);
		} else {
			this.router.navigate(['login/create-password']);
		}
	}
	changeViewState(viewState: string) {
		this.viewState = viewState;
	}
	onLogin() {
		this.router.navigate(['preferences/1']);
	}
	signInWithMicrosoft(): void {
		// this.socialAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID)
		// 	.catch(reason => { console.log(reason); });
	}
	signInWithGoogle(): void {
		this.googleService.googleSignin();
	}

}
