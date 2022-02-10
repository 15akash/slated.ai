import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { I_option } from '@core/services/data.service';
import { LocationComponent } from '../components/location/location.component';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface I_locationData {
	accessType: string;
}
export interface I_location {
	place_id?: string,
	name?: string,
	icon?: string,
	types?: string[],
	utc_offset_minutes?: number,

	address_components?: any,
	adr_address?: any,
	business_status?: any,
	formatted_address?: any,
	formatted_phone_number?: any,
	geometry?: any,
	icon_background_color?: any,
	international_phone_number?: any,
	opening_hours?: any,
	photos?: any,
	rating?: any,
	reference?: any,
	reviews?: any,
	url?: string,
	user_ratings_total?: any,
	vicinity?: any,
	website?: any,

	lat?: number,
	lng?: number,
	latLngId?: string,
	isSelected?: boolean,
	selectionColor?: string,
	isMyLocation?: boolean,
	displayName?: string,
	description?: string,
	travelDistance?: number,
	travelTime?: number,
}
export interface I_mapLocation {
	location: I_location,
	marker?: google.maps.Marker
}
export interface I_markerInput {
	iconType: string,
	title?: string,
	position?: google.maps.LatLng,
	selected?: boolean,
	placeDetails?: I_location
};



@Injectable({
	providedIn: 'root'
})
export class LocationService {
	isOpen = false;
	dialogRef!: MatDialogRef<LocationComponent>;
	constructor(
		public locationDialog: MatDialog,
		public http: HttpClient
	) {
	}
	showLocationDialog(data: I_locationData): void {
		if (this.isOpen) return; this.isOpen = true;
		this.dialogRef = this.locationDialog.open(LocationComponent, {
			width: '100vw', height: '100vh', data: data,
			panelClass: 'location-dialog'
		});
		this.dialogRef.afterClosed()
			.subscribe(result => {
				console.log('location box closed with result=', result);
			});
	}
	closeLocationDialog(): void {
		if (!this.isOpen) return;
		this.dialogRef.close();
	}

	getLocationSelectionTypeOptions(numSelectedLocations: number = 0, selectedDefaultLocation: boolean = false, numAttendees: number = 0): I_option[] {
		let t: I_option[] = [];
		t = [
			{
				displayName: 'Equidistant for all attendees', _id: 'equidistant', value: 'equidistant',
				disabled: (numSelectedLocations == 1 || (selectedDefaultLocation && numSelectedLocations == 0)) ? false : true
			},
			{
				displayName: 'I\'ll pick the location now', _id: 'my-pick', value: 'my-pick',
				disabled: (numSelectedLocations > 1 || (selectedDefaultLocation && numSelectedLocations == 1)) ? true : false
			},
			{
				displayName: 'Let invitees pick from my location list', _id: 'pick-from-my-list', value: 'pick-from-my-list',
				disabled: (numSelectedLocations > 1 || (numSelectedLocations == 1 && selectedDefaultLocation)) ? false : true
			},
			{
				displayName: 'Let invitees pick from map', _id: 'invitees-pick-from-map', value: 'invitees-pick-from-map',
				disabled: false
			},
			{ displayName: 'Custom location - type it in', _id: 'custom', value: 'custom', disabled: false },
		];
		return t;
	}
	getPlaceRequestFields(): string[] {
		return ['address_components', 'adr_address', 'business_status', 'formatted_address', 'formatted_phone_number', 'geometry', 'icon', 'icon_background_color', 'international_phone_number', 'name', 'photos', 'place_id', 'rating', 'reference', 'reviews', 'types', 'url', 'user_ratings_total', 'vicinity', 'website'];
	}
	getLatLngFromPlaceDetails(place: I_location): google.maps.LatLng | null {
		if (!place.geometry || !place.geometry.location) { return null; }
		const lat = typeof place.geometry.location.lat == 'number' ? place.geometry.location.lat : place.geometry.location.lat();
		const lng = typeof place.geometry.location.lng == 'number' ? place.geometry.location.lng : place.geometry.location.lng();
		return new google.maps.LatLng(lat, lng);
	}

}
