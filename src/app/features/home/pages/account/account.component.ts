import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { I_people } from '@core/services/people.service';
import { formatDisplayDate } from '@core/utils/utils';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	user!: I_people;
	createdAt: string = "";

	constructor(
		private authService: AuthService,
		private dialogService: DialogService,
		private localStorageService: LocalStorageService,
		private location: Location
	) {
		this.user = this.localStorageService.getLocal(LocalKey.user);
		if (this.user.createdAt) this.createdAt = formatDisplayDate(new Date(this.user.createdAt));
	}

	ngOnInit(): void {
	}
	onBackClick(): void { this.location.back(); }
	onClickLogout() { this.startLogout(); }
	onClickDeleteAccount(): void { this.startDeleteAccount(); }

	startLogout() {
		const logout = () => { this.authService.logout(); }
		this.dialogService.openDialog({
			title: "Logout?",
			msg: "Are you sure? You will lose all the preferences stored on this device.",
			btns: [
				{ btnTitle: "Cancel", type: "positive" },
				{ btnTitle: "Confirm", type: "neutral", callback: logout }
			]
		});
	}
	startDeleteAccount(): void {
		const deleteAccount = () => { this.authService.deleteAccount(); }
		this.dialogService.openDialog({
			title: "Delete account?",
			msg: "Are you sure? \nYou will lose all Slated data and any existing meeting links will stop working.",
			btns: [
				{ btnTitle: "Cancel", type: "positive" },
				{ btnTitle: "Confirm", type: "negative", callback: deleteAccount }
			]
		});
	}


}
