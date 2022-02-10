import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-note-icon',
	templateUrl: './note-icon.component.html',
	styleUrls: ['./note-icon.component.scss']
})
export class NoteIconComponent implements OnInit {
	isHovering = false;
	isFocused = false;

	constructor() { }

	ngOnInit(): void {
	}

}
