import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimezoneService } from '@core/services/timezone.service';
import { formatDisplayTime, formatDuration } from '@core/utils/utils';
import { I_location } from '../../services/location.service';

@Component({
	selector: 'app-location-list-item',
	templateUrl: './location-list-item.component.html',
	styleUrls: ['./location-list-item.component.scss']
})
export class LocationListItemComponent implements OnInit, OnChanges {

	locationTypeDisplayText: string = "";
	timezoneDisplayText: string = "";
	travelDistanceDisplayText: string = "";
	travelTimeDisplayText: string = "";

	@Input() data!: I_location;
	@Input() isSelected: boolean = false;
	@Input() selectionColor: string = 'blue';
	@Output() select = new EventEmitter();
	@Output() remove = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		if (this.data.travelDistance) this.travelDistanceDisplayText = (Math.round(this.data.travelDistance * 10 / 1000) / 10) + " km";
		if (this.data.travelTime) this.travelTimeDisplayText = formatDuration(this.data.travelTime / 60);
		if (this.data.types && this.data.types.length) this.locationTypeDisplayText = this.data.types[0].split('_').join(' ');
		if (this.data.utc_offset_minutes) {
			let currentDt = new Date(), offset = currentDt.getTimezoneOffset() * 1;
			if (offset && this.data.utc_offset_minutes && (this.data.utc_offset_minutes != -offset)) {
				this.timezoneDisplayText = formatDisplayTime(new Date(currentDt.getTime() + (offset - this.data.utc_offset_minutes) * 60 * 1000));
			} else this.timezoneDisplayText = "";
		}
		if (this.data.selectionColor) { this.selectionColor = this.data.selectionColor; }
		if (this.data.isSelected != null) { this.isSelected = this.data.isSelected; }
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data) {
			this.isSelected = changes.data.currentValue.isSelected;
		}
	}

	onSelect(): void {
		this.isSelected = !this.isSelected;
		this.select.emit({ location: this.data, action: this.isSelected ? 'selected' : 'unselected' });
	}
	removeItem(): void {
		this.remove.emit(this.data);
	}

}
