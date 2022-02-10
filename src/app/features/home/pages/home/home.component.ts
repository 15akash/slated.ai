import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { GoogleService } from '@core/services/google.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { I_meeting, I_meetingGroup, MeetingService } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { TimezoneService } from '@core/services/timezone.service';
import { LocationService } from 'src/app/features/location/services/location.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	assistantView = 'intro';
	assistantMeetingData!: I_meeting;

	user: I_people;

	// googleCalendarStatus = 'failed';
	// isLoadingMeetings = false;
	// isErrorMeetings = 0;
	// waitMeetingData = { title: "", msg: "" };

	meetingGroups: I_meetingGroup[] = [];

	constructor(
		iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
		private localStorageService: LocalStorageService,
		private dialogService: DialogService,
		private locationService: LocationService,
		private router: Router,
		private googleService: GoogleService,
		private apiService: ApiService,
		private meetingService: MeetingService
	) {
		this.user = this.localStorageService.getLocal(LocalKey.user);

		//this.updateGoogleCalendarStatus();
		// router.events.subscribe((val) => {
		// 	if (val instanceof NavigationEnd) {
		// 		if (val.url) {
		// 			console.log('url=', val.url);
		// 			let url = val.url.replace('/home', '');
		// 			const t = new URLSearchParams(url);
		// 			const code = t.get('code');
		// 			const selectedScopes = t.get('scope');
		// 			if (code) {
		// 				console.log('code=', code);
		// 				if (this.googleCalendarStatus != 'synced') {
		// 					let selectiveUpdates = ['calendar'];//this.user.googleCalendarAPIData?.selectiveUpdates || null;
		// 					this.updateGoogleCalendar({ code, selectedScopes, selectiveUpdates });
		// 				} else this.router.navigate(['/home']);
		// 			}
		// 		}
		// 	}
		// });
	}
	ngOnInit(): void {
		this.googleService.getCalendarList();
		this.meetingService.getMeetings().then((r: I_meetingGroup[]) => {
			console.log('meetings=', r);
			this.meetingGroups = r;
		}).catch(e => {
			console.log('error in meetings', e);
		})
	}


	// connectGoogleCalendar() {
	// 	this.googleService.connectCalendar();
	// }
	// updateGoogleCalendarStatus() {
	// 	let u = this.user;
	// 	console.log('user=', u);
	// 	let googleCalendarAPIData = u.googleCalendarAPIData;
	// 	if (!googleCalendarAPIData) this.googleCalendarStatus = 'failed';
	// 	else {
	// 		if (u.googleCalendarAPIData.status == 'syncing') {
	// 			this.googleCalendarStatus = 'syncing';
	// 		} else {
	// 			let last = new Date(googleCalendarAPIData.lastSyncDate).getTime();
	// 			let now = new Date().getTime();
	// 			if (now - last > 15 * 60 * 1000) {
	// 				this.googleCalendarStatus = 'failed';
	// 				this.startCalendarSync();
	// 			}
	// 			else this.googleCalendarStatus = 'synced';
	// 		}
	// 	}
	// }
	// startCalendarSync(): void {
	// 	let data = {
	// 		selectiveUpdates: ['calendar'],
	// 		syncing: true
	// 	};
	// 	this.updateGoogleCalendar(data);
	// }
	// updateGoogleCalendar(data: any = {}) {
	// 	console.log('googleCalendarStatus ', this.googleCalendarStatus);
	// 	if (this.googleCalendarStatus == 'busy') return;
	// 	this.googleCalendarStatus = 'busy';

	// 	if (!data.syncing) {
	// 		this.isLoadingMeetings = true;
	// 		this.waitMeetingData = { title: "Syncing Google calendar", msg: "Please wait. This can take a few seconds..." };
	// 	}

	// 	const onFail = () => {
	// 		this.googleCalendarStatus = 'failed';
	// 		this.isErrorMeetings = 3;
	// 		this.isLoadingMeetings = false;
	// 		this.waitMeetingData = { title: "", msg: "" };
	// 	}
	// 	console.log('updateGoogleCalendar call');
	// 	this.apiService.apiCall('updateGoogleAPIData', {
	// 		userId: this.user._id, fromPath: 'home', ...data
	// 	}).subscribe(res => {
	// 		if (res.status == 'success') {
	// 			if (res.authUrl) {
	// 				if (this.user.googleCalendarAPIData) {
	// 					this.user.googleCalendarAPIData.status = 'syncing';
	// 					this.user.googleCalendarAPIData.selectiveUpdates = data.selectiveUpdates;
	// 					this.localStorageService.storeLocal(LocalKey.user, this.user);
	// 				}
	// 				this.googleCalendarStatus = 'syncing';
	// 				window.open(res.authUrl, '_self');
	// 			} else {
	// 				console.log(res);
	// 				if (res.user && res.user.googleCalendarAPIData) {
	// 					this.user = res.user;
	// 					this.localStorageService.storeLocal(LocalKey.user, res.user);
	// 					this.googleCalendarStatus = 'synced';
	// 					this.isLoadingMeetings = false;
	// 					this.waitMeetingData = { title: "", msg: "" };
	// 					this.getMeetings();
	// 				} else onFail();
	// 			}
	// 		} else onFail();
	// 	}, e => { onFail(); });
	// }


	onSearch(e: any) {
		console.log('search event=', e);
	}
	startSchedule(): void {
		console.log('start schedule');
		this.router.navigate(['home/schedule']);
	}
	startNoteTaker(): void {
		console.log('start note taker');
	}
	onChangeTimeZone(e: any) {
		if (e.selectedOptions.length) {
			let defaultTimeZone = e.selectedOptions[0];
			this.localStorageService.storeLocal(LocalKey.defaultTimeZone, defaultTimeZone);
		}
	}
	onBackFromAssistant(e: any) {
		console.log(e);
		this.assistantView = 'intro';
	}
	onMeetingSelect(e: any, meeting: I_meeting, group: I_meetingGroup) {
		this.assistantView = 'meeting';
		this.assistantMeetingData = meeting;
		console.log('meeting select', this.assistantView);

	}

}
