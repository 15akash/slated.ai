import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';


@Component({
	selector: 'app-list-input',
	templateUrl: './list-input.component.html',
	styleUrls: ['./list-input.component.scss']
})
export class ListInputComponent implements OnInit, AfterViewChecked {
	isMenuOpen = false;
	isHovering = false;
	isFocused = false;
	highlightId = '';
	isHoveringId = '';
	@Input() displayOptions: I_option[] = [];
	@Input() selectedItem!: I_option;
	@Input() defaultIcon: string = "";
	@Input() displayType: string = "";
	@Input() placeholder: string = "Select from list";
	previousItem: I_option = this.selectedItem;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@Output() change = new EventEmitter();

	@ViewChild('inputCon') inputCon!: ElementRef;
	inputWidth: number = 0;

	constructor(
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit(): void { }
	ngAfterViewChecked(): void {
		if (this.inputCon) {
			// console.log('w=', this.inputCon.nativeElement.offsetWidth);
			this.inputWidth = this.inputCon.nativeElement.offsetWidth;
			this.cdRef.detectChanges();
		}
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
