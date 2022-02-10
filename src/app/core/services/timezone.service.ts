import { Injectable } from '@angular/core';
import { formatDisplayTime } from '@core/utils/utils';
import { ApiResponse, ApiService } from './api.service';
import { LocalKey, LocalStorageService } from './local-storage.service';

export interface I_timeZone {
	_id: string,
	groupName: string,
	name: string,
	utcOffset: number,
	abbreviation: string,
	displayText: string,
	places?: string,
	searchKeywords?: string,

	displayGMT?: string,
	displayLocalCurrentTime?: string,
}

export interface I_timeZoneResponse {
	timeZones: I_timeZone[],
	defaultTimeZone: I_timeZone,
}


@Injectable({
	providedIn: 'root'
})
export class TimezoneService {

	constructor(
		private apiService: ApiService,
		private localStorageService: LocalStorageService
	) { }

	getTimeZoneName() {
		const today = new Date();
		const short = today.toLocaleDateString(undefined);
		const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });

		// Trying to remove date from the string in a locale-agnostic way
		const shortIndex = full.indexOf(short);
		if (shortIndex >= 0) {
			const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);

			// by this time `trimmed` should be the timezone's name with some punctuation -
			// trim it from both sides
			return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');

		} else {
			// in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
			return full;
		}
	}
	getBrowserDefault() {
		return Intl.DateTimeFormat().resolvedOptions();
	}
	convertTimeZone(date: Date | string, timeZoneName: string): Date {
		return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: timeZoneName }));
	}

	getTimeZones(): Promise<I_timeZoneResponse> {

		const promise: Promise<I_timeZoneResponse> = new Promise((resolve, reject) => {
			let defaultTimeZone: I_timeZone = {
				"_id": "6",
				"groupName": "South Asia",
				"name": "Asia/Kolkata",
				"utcOffset": 330,
				"abbreviation": "IST",
				"displayText": "India Standard Time",
				"places": "Bengaluru, Bangalore, Chennai, Mumbai, New Delhi, Hyderabad",
				"searchKeywords": ""
			};
			this.apiService.apiCall('getTimeZones', {})
				.subscribe((res: ApiResponse) => {
					if (res && res.status == 'success') {
						let timeZone: I_timeZone = defaultTimeZone;
						let timeZones = res.data, tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
						for (let i = 0; i < timeZones.length; i++) {
							if (timeZones[i].name == tz) {
								timeZone = JSON.parse(JSON.stringify(timeZones[i]));
								break;
							}
						}
						if (timeZone) {
							defaultTimeZone = timeZone;
						}
						this.localStorageService.storeLocal(LocalKey.timeZones, timeZones);
						this.localStorageService.storeLocal(LocalKey.defaultTimeZone, defaultTimeZone);
						let response: I_timeZoneResponse = { defaultTimeZone, timeZones };
						resolve(response);
					} else reject(false);
				}, err => {
					reject(false);
				});
		});
		return promise;
	}
	getSuggestedTimezones(): Promise<I_timeZone[]> {
		const promise: Promise<I_timeZone[]> = new Promise((resolve, reject) => {
			this.apiService.apiCall('getSuggestedTimezones', {})
				.subscribe((res: ApiResponse) => {
					if (res && res.status == 'success') {
						let timeZones = res.data;
						resolve(timeZones);
					} else reject(false);
				}, err => {
					reject(false);
				});
		});
		return promise;
	}
	getGMTDisplay(timeZone: I_timeZone): string {
		let t = Math.round(10 * timeZone.utcOffset / 60) / 10;
		return 'GMT' + (t > 0 ? ' +' : (t < 0 ? ' ' : '')) + (t != 0 ? t : '');
	}
	getDefaultDisplay(timeZone: I_timeZone): string {
		return this.getGMTDisplay(timeZone) + '&bullet;' + timeZone.abbreviation;
	}
	getLocalCurrentTime(timeZone: I_timeZone): string {
		let date = this.convertTimeZone(new Date(), timeZone.name);
		return formatDisplayTime(date);
	}

}
