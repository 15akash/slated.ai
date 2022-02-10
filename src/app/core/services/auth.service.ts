import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { environment } from 'src/environments/environment';
import { LocalKey, LocalStorageService } from './local-storage.service';
import { I_people } from './people.service';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private authURL = environment.authURL;

	constructor(
		private http: HttpClient,
		private router: Router,
		private localStorageService: LocalStorageService,
		private dialogService: DialogService
	) {
	}

	apiCall(api: string, data: any) { return this.http.post<any>(this.authURL + api, data); }
	isLoggedIn(): boolean { return !!this.getToken(); }
	getToken(): string | null { return this.localStorageService.getLocal(LocalKey.token); }

	startSocialLogin(data: any): Promise<any> {
		const { signinType, signinData } = data;
		const promise = new Promise((resolve, reject) => {
			this.apiCall('socialLogin', { signinType, signinData })
				.subscribe(r => {
					if (r.status == 'success') {
						this.onSignIn(r.token, r.user);
						resolve(r);
					} else reject(r);
				}, e => { reject(e); })
		});
		return promise;
	}

	onLogout(): void {
		this.localStorageService.clearLocal(LocalKey.token);
		this.localStorageService.clearLocal(LocalKey.user);
		this.localStorageService.clearLocal(LocalKey.defaultTimeZone);
		this.localStorageService.clearLocal(LocalKey.timeZones);
		this.router.navigate(['/home']);
		window.location.reload();
	}
	logout(): void { this.onLogout(); }
	deleteAccount(): void {
		let user = this.localStorageService.getLocal(LocalKey.user);
		this.apiCall('deleteUser', { _id: user._id }).subscribe(
			r => {
				this.logout();
			}, e => {

			});
	}

	onSignIn(token: string, user: I_people): void {
		this.localStorageService.storeLocal(LocalKey.token, token);
		this.localStorageService.storeLocal(LocalKey.user, user);
	}
	getPhotoUrl(): string {
		let photoUrl = "";
		let user: I_people = this.localStorageService.getLocal(LocalKey.user);
		return photoUrl;
	}
	getUserName(): string {
		let user: I_people = this.localStorageService.getLocal(LocalKey.user);
		return user.name || "";
	}
	getUserEmail(): string {
		let user: I_people = this.localStorageService.getLocal(LocalKey.user);
		return user.email;
	}



}
