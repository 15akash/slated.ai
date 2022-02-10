import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResponse {
	status: string,
	data: any,
	reason?: string
}

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiURL = environment.apiURL;
	private rootURL = environment.rootURL;
	private authURL = environment.authURL;

	constructor(
		private http: HttpClient
	) { }
	apiCall(api: string, data: any, fileProgress: any = null) {
		if (fileProgress) return this.http.post<any>(this.apiURL + api, data, fileProgress);
		else return this.http.post<any>(this.apiURL + api, data);
	}

	getRequest(url: string) {
		return this.http.get(url);
	}
	download(api: string): Observable<Blob> {
		return this.http.get(this.apiURL + api, {
			responseType: 'blob'
		})
	}

}
