import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';

@Component({
	selector: 'app-view-selection',
	templateUrl: './view-selection.component.html',
	styleUrls: ['./view-selection.component.scss']
})
export class ViewSelectionComponent implements OnInit {
	isMenuOpen = false;
	isHovering = false;
	isFocused = false;
	highlightId = '1';
	isHoveringId = '';
	displayOptions: I_option[] = [
		{ _id: '1', displayName: 'List View', icon: 'menu_gray', highlightIcon: 'menu_blue' },
		{ _id: '2', displayName: 'Calendar View', icon: 'calendar' },
		// { _id: '3', displayName: 'Insights View', icon: 'flash' },
		// { _id: '4', displayName: 'Travel View', icon: 'route' },
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
		this.highlightId = item._id;
		this.change.emit({ value: item, previousValue: this.previousItem });
	}
}
