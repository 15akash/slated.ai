import { Component, Input, OnInit } from '@angular/core';
import { I_location } from '../../services/location.service';

@Component({
	selector: 'app-selected-place',
	templateUrl: './selected-place.component.html',
	styleUrls: ['./selected-place.component.scss']
})
export class SelectedPlaceComponent implements OnInit {
	@Input() data!: I_location;
	photoUrl: string = "";
	constructor() { }

	ngOnInit(): void {
		if (this.data && this.data.photos && this.data.photos.length) {
			this.photoUrl = this.data.photos[0].getUrl();
		} else this.photoUrl = "";
	}

}
