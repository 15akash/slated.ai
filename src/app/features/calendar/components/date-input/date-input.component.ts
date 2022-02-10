import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-date-input',
	templateUrl: './date-input.component.html',
	styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {

	@Input() currentDate: Date = new Date();
	@Output() change = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}
	onChange(): void {
		//this.change.emit(newDate);
	}

}
