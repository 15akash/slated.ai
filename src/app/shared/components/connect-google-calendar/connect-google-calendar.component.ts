import { Component, Input, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { E_signinType } from '@core/enums/enums';
import { ApiResponse, ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { GoogleService } from '@core/services/google.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { I_people } from '@core/services/people.service';
import { DialogService } from '../../services/dialog.service';


enum E_status {
	'disconnected' = 'disconnected',
	'connecting' = 'connecting',
	'connected' = 'connected',
	'revoked' = 'revoked',
	'notLoggedIn' = 'notLoggedIn',
	'unknown' = ''
}

@Component({
	selector: 'app-connect-google-calendar',
	templateUrl: './connect-google-calendar.component.html',
	styleUrls: ['./connect-google-calendar.component.scss']
})
export class ConnectGoogleCalendarComponent implements OnInit {
	@Input() title: string = "Connect Google calendar";
	status: string = E_status.unknown;
	user!: I_people;
	@Input() fromPath: string = 'home';

	googleCalendarStatus = 'failed';
	isLoadingMeetings = false;
	isErrorMeetings = 0;
	waitMeetingData = { title: "", msg: "" };

	googleUser!: gapi.auth2.GoogleUser;

	constructor(
		private googleService: GoogleService,
		private localStorageService: LocalStorageService,
		private dialogService: DialogService,
		private apiService: ApiService,
		private authService: AuthService,
		private router: Router,
		private ngZone: NgZone
	) {
		let user = this.localStorageService.getLocal(LocalKey.user);
		this.user = user;
		if (user) {
			if (user.googleCalendarAPIData) {
				this.googleService.checkGoogleTokens().subscribe((r: ApiResponse) => {
					if (r.status == 'success') {
						this.status = r.data && r.data.googleCalendarAPITokensValid ? E_status.connected : E_status.revoked;
					}
				});
			} else this.status = E_status.disconnected;
		} else this.status = E_status.notLoggedIn;

		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				if (val.url) {
					console.log('url=', val.url);
					let url = val.url.replace('/' + this.fromPath, '');
					const t = new URLSearchParams(url);
					const code = t.get('code');
					const selectedScopes = t.get('scope');
					if (code) {
						console.log('code=', code);
						if (this.googleCalendarStatus != 'synced') {
							let selectiveUpdates = ['calendar'];//this.user.googleCalendarAPIData?.selectiveUpdates || null;
							this.updateGoogleCalendar({ code, selectedScopes, selectiveUpdates });
						} else this.router.navigate(['/home']);
					}
				}
			}
		});

	}

	ngOnInit(): void {
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
								this.onClickConnect();
								// if (!r.user.preferences) this.router.navigate(['preferences/1']);
								// else this.router.navigate(['home']);
								//this.googleService.getCalendarList(this.googleUser);
							})
						}).catch(e => this.onLoginFail());
				} else this.onLoginFail();
			})
		}, e => this.onLoginFail("Something went wrong. Do contact support if this persists!"));
	}
	onLoginFail(msg = "Login attempt via Google failed. Please try again!"): void {
		this.dialogService.closeWait();
		this.dialogService.openDialog({ title: "Oops!", msg });
	}


	onClickConnect(): void {
		if (this.status == E_status.connected) {
			this.dialogService.openDialog({ title: "Already connected", msg: "Google calendar is already connected" });
		} else {
			if (this.authService.isLoggedIn()) {
				//LoggedIn user
				let user = this.user, fromPath = this.fromPath;
				this.status = E_status.connecting;
				this.apiService.apiCall('updateGoogleAPIData', { userId: user._id, fromPath, selectiveUpdates: ['calendar'], syncing: true })
					.subscribe(res => {
						if (res.status == 'success') {
							if (res.authUrl) {
								window.open(res.authUrl, '_self');
							} else {
								console.log(res);
								this.status = E_status.connected;
							}
						} else { console.log('calender failed', res); this.status = E_status.disconnected; }
					}, e => {
						console.log('calender failed', e); this.status = E_status.disconnected;
					});
			} else {
				this.googleService.googleSignin2();
			}

		}
	}

	updateGoogleCalendar(data: any = {}) {
		console.log('googleCalendarStatus ', this.googleCalendarStatus);
		if (this.googleCalendarStatus == 'busy') return;
		this.googleCalendarStatus = 'busy';

		if (!data.syncing) {
			this.isLoadingMeetings = true;
			this.waitMeetingData = { title: "Syncing Google calendar", msg: "Please wait. This can take a few seconds..." };
		}

		const onFail = () => {
			this.googleCalendarStatus = 'failed';
			this.isErrorMeetings = 3;
			this.isLoadingMeetings = false;
			this.waitMeetingData = { title: "", msg: "" };
		}
		console.log('updateGoogleCalendar call');
		this.apiService.apiCall('updateGoogleAPIData', {
			userId: this.user._id, fromPath: this.fromPath, ...data
		}).subscribe(res => {
			if (res.status == 'success') {
				if (res.authUrl) {
					if (this.user.googleCalendarAPIData) {
						this.user.googleCalendarAPIData.status = 'syncing';
						this.user.googleCalendarAPIData.selectiveUpdates = data.selectiveUpdates;
						this.localStorageService.storeLocal(LocalKey.user, this.user);
					}
					this.googleCalendarStatus = 'syncing';
					window.open(res.authUrl, '_self');
				} else {
					console.log(res);
					if (res.user && res.user.googleCalendarAPIData) {
						this.user = res.user;
						this.localStorageService.storeLocal(LocalKey.user, res.user);
						this.googleCalendarStatus = 'synced';
						this.isLoadingMeetings = false;
						this.waitMeetingData = { title: "", msg: "" };
						this.getMeetings();
					} else onFail();
				}
			} else onFail();
		}, e => { onFail(); });
	}

	getMeetings() {
		console.log('called getMeetings');
	}

}
