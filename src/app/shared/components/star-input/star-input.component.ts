import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-star-input',
	templateUrl: './star-input.component.html',
	styleUrls: ['./star-input.component.scss']
})
export class StarInputComponent implements OnInit {
	@Input() notEditable: boolean = false;
	@Input() value: number = 0;

	@Output() change = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}
	onClick(): void {
		if (this.notEditable) return;
		let v = this.value; v++;
		this.value = v % 3;
		this.change.emit(this.value);
	}

}
