import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService, I_option } from '@core/services/data.service';

@Component({
	selector: 'app-color-input',
	templateUrl: './color-input.component.html',
	styleUrls: ['./color-input.component.scss']
})
export class ColorInputComponent implements OnInit {

	colorOptions: I_option[] = [];
	@Input() selectedColor!: I_option;
	previousColor!: I_option;
	@Output() change = new EventEmitter();

	constructor(
		private dataService: DataService
	) {
		this.colorOptions = this.dataService.getColorOptions();
		this.selectedColor = this.dataService.getDefaultcolorOption();
	}

	ngOnInit(): void {
	}
	onSelectColor(item: I_option) {
		this.previousColor = this.selectedColor;
		this.selectedColor = item;
		this.change.emit({ value: item, previousValue: this.previousColor });
	}

}
