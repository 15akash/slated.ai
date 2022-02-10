import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I_option } from '@core/services/data.service';
import { DialogService, I_btnType } from 'src/app/shared/services/dialog.service';
import { I_location, I_locationData, I_mapLocation, I_markerInput, LocationService } from '../../services/location.service';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GoogleMap } from '@angular/google-maps';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.scss']
})
export class LocationComponent implements AfterViewChecked, OnInit {
	locationForm: FormGroup;
	locationSelectionTypeOptions: I_option[] = [];
	mapLocations: I_mapLocation[] = [];
	searchLocations: I_location[] = [];
	defaultLocation!: I_mapLocation | null;
	//iconPool: string[] = ['blue', 'yellow', 'orange', 'green'];
	iconPool: string[] = ['blue'];

	/**Google maps init variables */
	timeToLoadAPI = 0;
	startTime = new Date().getTime();
	apiLoaded: Observable<boolean>;
	center: google.maps.LatLngLiteral = { lat: 12.97604653618041, lng: 77.59286658173227 };
	mapOptions: google.maps.MapOptions = {
		center: this.center,
		zoom: 14,
		mapTypeId: 'roadmap',
		mapId: '8712cd4b48a88392',
		disableDefaultUI: false,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
	};
	locationAccuracy!: number | null;
	locationAltitude!: number | null;
	changedCenter: boolean = false;

	isPlaceInitialised: boolean = false;
	@ViewChild('gmap', { static: false }) gmap!: GoogleMap;
	@ViewChild('typedLocation') typedLocation!: ElementRef;
	@ViewChild("scrollCon") scrollCon!: ElementRef;

	placesService!: google.maps.places.PlacesService;
	//autoCompleteService!: google.maps.places.AutocompleteService;
	geocoder!: google.maps.Geocoder;

	currentHighlight: string = "";
	selectedPlace: any;
	selectedLatLngIds: string[] = [];

	showWaiting: boolean = false;
	disableSave: boolean = false;
	disableMap: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<LocationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_locationData,
		private fb: FormBuilder,
		private locationService: LocationService,
		http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		this.locationForm = this.fb.group({
			locationSelectionType: ['equidistant', [Validators.required]],
			typedLocation: ['']
		});
		//this.locationSelectionTypeOptions = this.locationService.getLocationSelectionTypeOptions();
		this.updateLocationSelectionTypes();
		this.apiLoaded = http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCMY5Bxw-bjtL6gXa_RYM2hJxTapsjrhIQ&libraries=places,geometry&v=beta', 'callback')
			.pipe(
				map(() => {
					console.log('api loading success');
					this.timeToLoadAPI = (new Date().getTime()) - this.startTime;
					return true;
				}),
				catchError((e) => {
					console.log('api loading failed', e);
					return of(false);
				})
			)
		this.gf.locationSelectionType.valueChanges.subscribe((value: any) => {
			this.disableMap = false;
			if (value) {
				if (value == 'custom') {
					this.disableMap = true;
					setTimeout(() => { if (this.typedLocation) this.typedLocation.nativeElement.focus(); }, 0);
				} else if (value == 'invitees-pick-from-map') {
					this.disableMap = true;
				}
			}
			this.validateForm();
		});
		this.gf.typedLocation.valueChanges.subscribe((value: any) => {
			this.validateForm();
		});
	}
	get gf() { return this.locationForm.controls; }
	validateForm() {
		if (!this.locationForm.valid) { this.disableSave = true; return }
		let locationSelectionType = this.gf.locationSelectionType.value;
		if (locationSelectionType == 'custom') {
			this.disableSave = !this.gf.typedLocation.value;
			return;
		}
		if (['equidistant', 'my-pick', 'my-pick', 'invitees-pick-from-map'].includes(locationSelectionType)) {
			let t = this.locationSelectionTypeOptions.filter(x => { return x.value == locationSelectionType; });
			this.disableSave = (t && t.length && t[0].disabled) ? true : false;
		}
	}

	ngOnInit(): void { }
	ngAfterViewChecked(): void {
		if (this.apiLoaded && !this.isPlaceInitialised && this.gmap) {
			this.initPlaceSearch();
			this.geocoder = new google.maps.Geocoder();
			setTimeout(() => {
				this.getCurrentLocation()
					.then(p => {
						this.updateRecommendedPlaces(this.center);
						this.getPlaceDetailsFromLatLng(p.lat, p.lng)
							.then(placeDetails => {
								if (placeDetails) {
									this.defaultLocation = {
										marker: this.addMarker({
											iconType: 'home',
											title: "Current location" + (placeDetails.formatted_address ? ": " + placeDetails.formatted_address : ""),
											position: new google.maps.LatLng(p),
											placeDetails,
											selected: true
										}),
										location: { ...placeDetails, isSelected: true, lat: p.lat, lng: p.lng, latLngId: [p.lat, p.lng].join("-") }
									}
									this.updateLocationSelectionTypes();
								}
							}).catch(e => { });
					}).catch(e => { });
			}, 0);
		}
	}
	initPlaceSearch(): void {
		const map = this.gmap.googleMap;
		if (map) {
			this.placesService = new google.maps.places.PlacesService(map);
			//this.autoCompleteService = new google.maps.places.AutocompleteService();
			this.isPlaceInitialised = true;
			map.addListener("dragend", () => {
				console.log('drag end call');
				this.clearAllRecommendedPlaces();
				let center = map.getCenter();
				if (center) this.updateRecommendedPlaces(center.toJSON());
			});
			map.addListener("zoom_changed", () => {
				console.log('zoom_changed call');
				this.clearAllRecommendedPlaces();
				let center = map.getCenter();
				if (center) this.updateRecommendedPlaces(center.toJSON());
			});
		}
	}
	onSearch(searchString: any) {
		console.log('searchString=', searchString);
		if (searchString && this.isPlaceInitialised) {
			this.placesService.textSearch({
				query: searchString,
				type: "establishment",
				//type: "hospital",//"hospital", //
				//type: "establishment",
				//radius: 5000, position: this.center
			},
				(results, status, pagination) => {
					if (status !== "OK" || !results) return;
					console.log('place options=', results);
					this.searchLocations = results;
					this.cdRef.detectChanges();
				}
			);
		} else {
			this.searchLocations = [];
			this.cdRef.detectChanges();
		}
	}
	onSelectSearchResult(selectedLocation: I_location, index: number) {
		//this.clearAllRecommendedPlaces();
		let position = this.locationService.getLatLngFromPlaceDetails(selectedLocation);
		this.searchLocations = [];
		this.addPlace(selectedLocation, position, true, true);
	}
	updateRecommendedPlaces(center: google.maps.LatLngLiteral): void {
		this.showWaiting = true;
		this.placesService.nearbySearch({
			location: center,
			//keyword: 'hospitals pharmacy doctor',
			//type: 'hospital', //type: "establishment", 
			keyword: 'cafe, restaurant, pub, fine dining, co-working space, library',
			type: 'cafe',
			radius: 5000, rankBy: google.maps.places.RankBy.PROMINENCE
		},
			(results, status, pagination) => {
				this.showWaiting = false;
				if (status !== "OK" || !results) return;
				let options: I_location[] = [];
				results.forEach((x: google.maps.places.PlaceResult) => {
					if (!x.business_status || (x.business_status && x.business_status == 'OPERATIONAL')) {
						let latLng = this.locationService.getLatLngFromPlaceDetails(x);
						this.addPlace(x, latLng, false);
						options.push(x);
					}
				});
				this.cdRef.detectChanges();
				console.log('nearby options=', options);
			}
		);
	}
	updateMapCenter(center: google.maps.LatLng, pan: boolean = true): void {
		if (pan) {
			const map = this.gmap.googleMap;
			if (map) map.panTo(center);
		} else {
			this.mapOptions.center = center;
			this.center = center.toJSON();
		}
	}

	closeDialog(): void { this.dialogRef.close("close"); }
	onBtnClick(btnData: I_btnType) { if (btnData.callback) btnData.callback(); this.dialogRef.close(); }


	onMapClick = (event: any) => {
		this.currentHighlight = '';
		if (!event.latLng) return;
		if (event.placeId) {
			this.showWaiting = true;
			this.placesService.getDetails({ placeId: event.placeId, fields: this.locationService.getPlaceRequestFields() },
				(placeDetails) => {
					this.showWaiting = false;
					if (placeDetails && this.checkValidMeetingPlace(placeDetails)) this.addPlace(placeDetails, event.latLng, true, true);
					else this.onSelectInvalidPlace(event.latLng);
				});
		} else {
			this.showWaiting = true;
			this.getPlaceDetailsFromLatLng(event.latLng.lat(), event.latLng.lng()).then(placeDetails => {
				this.showWaiting = false;
				if (placeDetails && this.checkValidMeetingPlace(placeDetails)) this.addPlace(placeDetails, event.latLng, true, true);
				else this.onSelectInvalidPlace(event.latLng);
			}).catch(e => { this.onSelectInvalidPlace(event.latLng); this.showWaiting = false; });
		}
	}
	checkValidMeetingPlace(placeDetails: google.maps.places.PlaceResult) {
		return (placeDetails.types && placeDetails.types.length && placeDetails.types[0] != 'plus_code') ? true : false;
	}
	addPlace(placeDetails: google.maps.places.PlaceResult, latLng: google.maps.LatLng | null = null, isSelected: boolean = true, addToTop: boolean = false): void {
		let iconType = this.iconPool[this.mapLocations.length % this.iconPool.length];
		let location: I_location = { ...placeDetails }, marker;
		location.selectionColor = iconType;
		location.isSelected = isSelected;
		if (latLng) {
			let t2 = latLng.toJSON();
			location.latLngId = [t2.lat, t2.lng].join('-');
			marker = this.addMarker({ iconType, title: location?.name || "", position: latLng, selected: isSelected });
		}
		let mapLocation = { location, marker };
		if (addToTop) this.mapLocations.splice(0, 0, mapLocation);
		else this.mapLocations.push(mapLocation);
		if (isSelected) this.selectPlace(mapLocation);
	}
	selectPlace(mapLocation: I_mapLocation): void {
		console.log('select place=', mapLocation.location);
		let { location, marker } = mapLocation;
		this.currentHighlight = 'selectedPlace';
		if (location) {
			this.selectedPlace = location;
			location.isSelected = true;
			if (location.latLngId) this.selectedLatLngIds.push(location.latLngId);
		}
		if (marker) {
			let icon = this.getMarkerIcon(location?.selectionColor || 'home', true);
			marker.setIcon(icon);
			let p = marker.getPosition();
			if (p) this.updateMapCenter(p);
		}
		this.updateLocationSelectionTypes();
		this.validateForm();
		this.scrollToSelected(mapLocation);
		this.cdRef.detectChanges();
	}
	unselectPlace(mapLocation: I_mapLocation): void {
		let { location, marker } = mapLocation;
		this.currentHighlight = '';
		this.selectedPlace = null;
		if (location) {
			location.isSelected = false;
			if (location.latLngId) this.selectedLatLngIds.splice(this.selectedLatLngIds.indexOf(location.latLngId), 1);
		}
		if (marker) {
			let icon = this.getMarkerIcon(location?.selectionColor || 'home', false);
			marker.setIcon(icon);
		}
		this.updateLocationSelectionTypes();
		this.validateForm();
		this.cdRef.detectChanges();
	}
	onSelectInvalidPlace(latLng: google.maps.LatLng | null): void { this.currentHighlight = 'invalidLocation'; }
	updateLocationSelectionTypes() {
		let numSelectedLocations: number = 0;
		this.mapLocations.forEach(x => { if (x.location.isSelected) numSelectedLocations++; });
		let selectedDefaultLocation = this.defaultLocation ? (!!this.defaultLocation.location.isSelected) : false;
		let numAttendees: number = 0;
		this.locationSelectionTypeOptions = this.locationService.getLocationSelectionTypeOptions(numSelectedLocations, selectedDefaultLocation);
	}
	scrollToSelected = (mapLocation: I_mapLocation) => {
		if (!this.scrollCon) return;
		let count = 0;
		for (let i = 0, len = this.mapLocations.length; i < len; i++) {
			let t = this.mapLocations[i];
			if (t.location.place_id == mapLocation.location.place_id) break;
			else count++;
		}
		if (this.defaultLocation && this.defaultLocation.location.isSelected) count++;
		let scrollH = count > 2 ? ((count - 2) * 110) : 0;
		if (this.scrollCon) { this.scrollCon.nativeElement.scrollTo({ top: scrollH }); }
	}

	getPlaceDetailsFromLatLng(lat: number, lng: number): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			if (!this.geocoder) { reject('error_no_geocoder'); return; }
			this.geocoder
				.geocode({ location: { lat, lng } })
				.then((response) => {
					let place = response.results[0];
					if (place && place.place_id) {
						this.placesService.getDetails({
							placeId: place.place_id,
							fields: this.locationService.getPlaceRequestFields()
						}, (placeDetails) => {
							resolve(placeDetails);
						});
					} else {
						resolve(null);
					}
				})
				.catch((e) => { console.log("Geocoder failed due to: " + e); reject(e); });
		})
		return promise;
	}

	addMarker(data: I_markerInput): google.maps.Marker | undefined {
		const { iconType, title, position, placeDetails, selected } = data;
		const map = this.gmap.googleMap;
		if (!map) return undefined; if (!position) return undefined;
		if (['home', 'blue', 'green', 'yellow', 'orange'].indexOf(iconType) < 0) return undefined;
		let icon = this.getMarkerIcon(iconType, selected);
		let options: google.maps.MarkerOptions = {
			icon, title: title || "", position: position.toJSON(),
			clickable: true, draggable: true, map
		};
		let marker = new google.maps.Marker(options);

		let t = position!.toJSON(), markerId = [t.lat, t.lng].join('-');
		let customValues: any = { 'latLngId': markerId };
		if (placeDetails) customValues = { ...customValues, 'place_id': placeDetails?.place_id }
		marker.setValues(customValues);

		this.onMarkerClick.bind(this);
		marker.addListener('click', this.onMarkerClick);
		return marker;
	}
	getMarkerIcon(iconType: string, selected: boolean = false): google.maps.Icon {
		let icon: google.maps.Icon = {
			url: '../../assets/map-icons/' + iconType + (selected ? '_selected' : '') + '.png',
			size: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(25, 35),
			scaledSize: new google.maps.Size(50, 50),
		};
		return icon;
	}
	onMarkerClick = (event: google.maps.MapMouseEvent) => {
		if (!event || !event.latLng) return;
		let t = event.latLng!.toJSON(), markerId = [t.lat, t.lng].join('-');
		if (markerId == this.defaultLocation?.location.latLngId) {
			if (this.defaultLocation.location.isSelected) this.unselectPlace(this.defaultLocation);
			else this.selectPlace(this.defaultLocation);
			this.defaultLocation.location = JSON.parse(JSON.stringify(this.defaultLocation.location));
		} else {
			for (let i = 0, len = this.mapLocations.length; i < len; i++) {
				let x = this.mapLocations[i];
				if (x.location.latLngId == markerId) {
					if (x.location.isSelected) this.unselectPlace(x);
					else this.selectPlace(x);
					break;
				}
			}
		}
	}
	clearAllMarkers() { this.mapLocations.forEach((item) => { item.marker?.setMap(null); }); }
	clearAllRecommendedPlaces(): void {
		this.clearAllMarkers();
		this.mapLocations = [];
	}

	onMapMousemove(event: google.maps.MapMouseEvent): void { this.changedCenter = true; }
	getCurrentLocation(): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			this.currentHighlight = 'detectingLocation';
			if (!navigator.geolocation) {
				this.currentHighlight = 'browserNotSupported';
				reject('browserNotSupported');
				return;
			}
			navigator.geolocation.getCurrentPosition((p) => {
				this.currentHighlight = '';
				this.locationAccuracy = Math.round(p.coords.accuracy);
				this.locationAltitude = p.coords.altitude ? Math.round(p.coords.altitude) : null;
				this.mapOptions.center = { lat: p.coords.latitude, lng: p.coords.longitude };
				this.center = { lat: p.coords.latitude, lng: p.coords.longitude };
				resolve({ lat: p.coords.latitude, lng: p.coords.longitude });
			}, e => {
				this.currentHighlight = 'deniedLocation';
				reject('deniedLocation');
			})
		});
		return promise;
	}

	onSelectLocation(data: any) {
		let mapLocation = this.mapLocations.filter(x => { return data.location.place_id == x.location.place_id });
		if (mapLocation.length) {
			if (data.action == 'selected') this.selectPlace(mapLocation[0]);
			else this.unselectPlace(mapLocation[0]);
		} else {
			if (this.defaultLocation && (data.location.place_id == this.defaultLocation.location.place_id)) {
				if (data.action == 'selected') this.selectPlace(this.defaultLocation);
				else this.unselectPlace(this.defaultLocation);
			}
		}

	}
	onRemoveLocation(location: I_location) {
		if (this.defaultLocation && location.place_id == this.defaultLocation.location.place_id) {
			this.defaultLocation = null;
		} else {
			let t: I_mapLocation[] = [];
			for (let i = 0, len = this.mapLocations.length; i < len; i++) {
				let item = this.mapLocations[i];
				if (location.place_id == item.location.place_id) {
					item.marker?.setMap(null);
				} else t.push(item);
			}
			this.mapLocations = t;
		}
	}

	onSave() {
		console.log('on save');
	}
}
