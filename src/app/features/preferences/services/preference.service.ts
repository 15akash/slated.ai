import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Injectable({
	providedIn: 'root'
})
export class PreferenceService {

	constructor(
		private router: Router,
		private snackBar: MatSnackBar,
		private apiService: ApiService
	) { }
	next(value: any, currentPage: number) {
		// console.log('next value:', value);
		this.router.navigate([this.getNextPage(currentPage)]);
		this.snackBar.open("Saving...");
		this.apiService.apiCall('savePreferences', value).subscribe(r => {
			this.snackBar.dismiss();
			if (r.status != 'success') this.snackBar.open("Failed to save", "Dismiss", { duration: 3000 });
		}, e => {
			this.snackBar.dismiss();
			this.snackBar.open("Failed to save", "Dismiss", { duration: 3000 });
		});
	}
	getNextPage(currentPage: number): string {
		if (currentPage < 5) return 'preferences/' + (currentPage + 1) + '';
		else return 'home';
	}
	getPreviousPage(currentPage: number): string {
		if (currentPage == 1) return 'login';
		else return 'preferences/' + (currentPage - 1);
	}

	onSkip(currentPage: number): void {
		this.router.navigate([this.getNextPage(currentPage)]);
	}
	onPrevious(currentPage: number): void {
		this.router.navigate([this.getPreviousPage(currentPage)]);
	}
	onRemindLater(currentPage: number): void {
		this.router.navigate(['home']);
	}

}
