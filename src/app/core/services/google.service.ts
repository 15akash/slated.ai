import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { LocalKey, LocalStorageService } from './local-storage.service';

export interface I_googleSigninData {
	email: string,
	name?: string,
	firstName?: string,
	familyName?: string,
	givenName?: string,
	id?: string,
	photoUrl?: string,
	grantedScopes?: any,
	hasGrantedScopes?: any,
	authResponse?: any
}


@Injectable({
	providedIn: 'root'
})
export class GoogleService {

	public isGapiLoaded: boolean = false;
	private auth2!: gapi.auth2.GoogleAuth;
	private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)

	constructor(
		private apiService: ApiService,
		private localStorageService: LocalStorageService
	) {
		gapi.load('auth2', () => {
			console.log('gapi loaded');
			this.isGapiLoaded = true;
			this.auth2 = gapi.auth2.init({
				client_id: '536147460462-6aica227mc873kap17uofnfd78jfvqka.apps.googleusercontent.com'
			})
		});
	}

	public googleSignin() {
		this.auth2.signIn({
			//scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly"
		}).then(user => {
			this.subject.next(user);
		}).catch(e => {
			this.subject.next(undefined);
		});
	}
	public googleSignin2() {
		this.auth2.signIn({
			scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly"
		}).then(user => {
			this.subject.next(user);
		}).catch(e => {
			this.subject.next(undefined);
		});
	}

	public googleSignout() {
		this.auth2.signOut().then(() => {
			this.subject.next(undefined);
		});
	}
	public getGoogleUserAsObservable(): Observable<gapi.auth2.GoogleUser> {
		return this.subject.asObservable();
	}
	public isValidGoogleSignIn(googleSigninData: I_googleSigninData) {
		return googleSigninData && googleSigninData.email;
	}
	public getSigninData(user: gapi.auth2.GoogleUser): I_googleSigninData {
		return {
			email: user.getBasicProfile().getEmail(),
			name: user.getBasicProfile().getName(),
			familyName: user.getBasicProfile().getFamilyName(),
			givenName: user.getBasicProfile().getGivenName(),
			id: user.getBasicProfile().getId(),
			photoUrl: user.getBasicProfile().getImageUrl(),
			grantedScopes: user.getGrantedScopes(),
			authResponse: user.getAuthResponse()
		}
	}
	public getCalendarList(fromPath: string = 'home'): void {
		this.apiService.apiCall('getGoogleCalendarList', { fromPath }).subscribe(r => {
			console.log(r);
		}, e => {
			console.log('calendar list error ', e);
		});
	}
	public connectCalendar(fromPath: string = 'home') {
		console.log('connect calendar');
		let user = this.localStorageService.getLocal(LocalKey.user);
		this.apiService.apiCall('updateGoogleAPIData', {
			userId: user._id, fromPath, selectiveUpdates: ['calendar'], syncing: true
		}).subscribe(res => {
			if (res.status == 'success') {
				if (res.authUrl) {
					window.open(res.authUrl, '_self');
				} else {
					console.log(res);
				}
			} else console.log('calender failed', res);
		}, e => { console.log('calender failed', e) });
	}
	public checkGoogleTokens(): Observable<ApiResponse> {
		return this.apiService.apiCall('checkGoogleTokens', {});
	}
	public insertToGoogleCalendar() {

	}

}
