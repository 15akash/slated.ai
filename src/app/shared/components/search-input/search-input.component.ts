import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
	searchForm!: FormGroup;

	@Input() defaultCollapse: boolean = false;
	@Input() toolTipForCollapse: string = "";
	@Input() placeholder: string = "Search";
	@Input() tabindex: number = 1;
	@Input() showSelectAll: boolean = false;
	isCollapsed: boolean = false;
	isHovering: boolean = false;
	isFocused: boolean = false;

	@Output() search = new EventEmitter();
	@Output() selectAll = new EventEmitter();

	@ViewChild('searchInputElement') searchInputElement!: ElementRef;

	constructor(
		fb: FormBuilder
	) {
		this.searchForm = fb.group({ searchString: '' });
		this.gf.searchString.valueChanges.subscribe(value => {
			this.onChange(value);
		});
	}
	ngOnInit(): void {
		if (this.defaultCollapse) this.isCollapsed = true;
	}
	onFocus() {
		if (this.defaultCollapse) this.isCollapsed = false;
		this.isFocused = true;
		this.isHovering = true;
	}
	onBlur() {
		if (this.defaultCollapse) {
			if (!this.gf.searchString.value) this.isCollapsed = true;
		}
		this.isFocused = false;
		this.isHovering = false;
	}

	get gf() {
		return this.searchForm.controls;
	}
	clearSearch() {
		this.searchForm.patchValue({ searchString: "" });
		this.onChange("");
	}
	onChange(searchString: string): void {
		this.search.emit(searchString || "");
	}
	onMenuClick(e: MouseEvent) { e.stopPropagation(); console.log('on menu click'); }

	onSelectAll(): void {
		this.selectAll.emit('selectAll');
	}

}
