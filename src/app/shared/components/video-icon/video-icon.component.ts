import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-video-icon',
	templateUrl: './video-icon.component.html',
	styleUrls: ['./video-icon.component.scss']
})
export class VideoIconComponent implements OnInit {
	isHovering = false;
	isFocused = false;

	constructor() { }

	ngOnInit(): void {
	}

}
