import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { I_timeZone } from './timezone.service';

export interface I_people {
	_id?: string,
	email: string,
	name?: string,
	googleData?: any,
	title?: string,
	photoUrl?: string,
	timeZone?: I_timeZone,
	optional?: boolean,
	isYou?: boolean,
	isCreator?: boolean,
	importance?: number,
	status?: string,
	responseStatus?: string,
	permission?: string,

	//User only
	googleCalendarAPIData?: any,
	signupType?: string,
	createdAt?: string
}
export interface I_peopleResponse {
	status?: string,
	people: I_people[],
	limit?: number,
	skip?: number,
	totalItems?: number
}


@Injectable({
	providedIn: 'root'
})
export class PeopleService {

	constructor(
		private apiService: ApiService
	) { }

	getPeople(searchString: string = ""): Promise<I_peopleResponse> {
		const promise: Promise<I_peopleResponse> = new Promise((resolve, reject) => {
			this.apiService.apiCall('getPeople', { searchString, limit: 20 })
				.subscribe((res: I_peopleResponse) => {
					console.log(res);
					if (res && res.status == 'success') {
						resolve(res);
					} else reject(false);
				}, err => {
					reject(false);
				});
		});
		return promise;
	}

}
