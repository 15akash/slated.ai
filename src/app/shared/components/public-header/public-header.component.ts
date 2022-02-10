import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';

@Component({
	selector: 'app-public-header',
	templateUrl: './public-header.component.html',
	styleUrls: ['./public-header.component.scss']
})
export class PublicHeaderComponent implements OnInit {

	isLoggedIn = false;
	constructor(
		private router: Router,
		private localStorageService: LocalStorageService,
		private apiService: ApiService,
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.isLoggedIn = this.authService.isLoggedIn();
		// let user = this.localStorageService.getLocal(LocalKey.user);
		// let token = this.localStorageService.getLocal(LocalKey.token);
		// if (!!user && !!token) this.isLoggedIn = true;
	}

	goHome(): void { this.router.navigate(['/home']); }
	startLogin(): void { this.router.navigate(['/login']); }
	startSignup(): void { this.router.navigate(['/login?signup=1']); }


}
