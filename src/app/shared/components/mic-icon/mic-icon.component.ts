import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-mic-icon',
	templateUrl: './mic-icon.component.html',
	styleUrls: ['./mic-icon.component.scss']
})
export class MicIconComponent implements OnInit {
	isHovering = false;
	isFocused = false;

	constructor() { }

	ngOnInit(): void {
	}

}
