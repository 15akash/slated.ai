import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-location-icon',
	templateUrl: './location-icon.component.html',
	styleUrls: ['./location-icon.component.scss']
})
export class LocationIconComponent implements OnInit {
	isHovering = false;
	isFocused = false;

	constructor() { }

	ngOnInit(): void {
	}

}
