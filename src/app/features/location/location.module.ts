import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './components/location/location.component';
import { MatDialogRef } from '@angular/material/dialog';
import { LocationService } from './services/location.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationListItemComponent } from './components/location-list-item/location-list-item.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { LocationMsgComponent } from './components/location-msg/location-msg.component';
import { SelectedPlaceComponent } from './components/selected-place/selected-place.component';
import { SearchListItemComponent } from './components/search-list-item/search-list-item.component';


@NgModule({
	declarations: [
		LocationComponent,
		LocationListItemComponent,
  LocationMsgComponent,
  SelectedPlaceComponent,
  SearchListItemComponent
	],
	imports: [
		CommonModule,
		LocationRoutingModule,
		SharedModule,
		GoogleMapsModule,
		HttpClientModule,
		HttpClientJsonpModule
	],
	providers: [
		{
			provide: MatDialogRef,
			useValue: {}
		},
		LocationService
	]
})
export class LocationModule { }
