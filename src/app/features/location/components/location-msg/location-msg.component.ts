import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-location-msg',
	templateUrl: './location-msg.component.html',
	styleUrls: ['./location-msg.component.scss']
})
export class LocationMsgComponent implements OnInit {
	@Input() msgType: string = '';
	constructor() { }

	ngOnInit(): void {
	}

}
