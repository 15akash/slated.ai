import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
	@Input() status = 'pending';
	@Input() displayType = '';

	constructor() { }

	ngOnInit(): void {
	}

}
