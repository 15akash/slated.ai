import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';

@Component({
	selector: 'app-calendar-selection',
	templateUrl: './calendar-selection.component.html',
	styleUrls: ['./calendar-selection.component.scss']
})
export class CalendarSelectionComponent implements OnInit {

	isMenuOpen = false;
	highlightId = '1';
	displayOptions: I_option[] = [
		{ _id: '1', displayName: 'My slate' },
		// { _id: '2', displayName: 'Calendar 2' },
		// { _id: '3', displayName: 'Calendar 3' }
	];
	selectedItem: I_option = this.displayOptions[0];
	previousItem: I_option = this.selectedItem;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@Output() change = new EventEmitter();
	constructor() { }

	ngOnInit(): void {
	}
	onOpenMenu(): void {
		this.isMenuOpen = true;
	}
	onCloseMenu(): void {
		this.isMenuOpen = false;
	}
	onMenuClick(e: MouseEvent): void {
		e.stopPropagation();
	}
	onSelect(item: I_option, index: number) {
		this.menuTrigger.closeMenu();
		this.previousItem = this.selectedItem;
		this.selectedItem = item;
		this.highlightId = this.selectedItem._id;
		this.change.emit({ value: item, previousValue: this.previousItem });
	}

}
