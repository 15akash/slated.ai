import { Component, Input, OnInit } from '@angular/core';
import { I_location } from '../../services/location.service';

@Component({
	selector: 'app-search-list-item',
	templateUrl: './search-list-item.component.html',
	styleUrls: ['./search-list-item.component.scss']
})
export class SearchListItemComponent implements OnInit {

	@Input() data!: I_location;
	displayTitle: string = "";
	displaySubtitle: string = "";
	constructor() { }

	ngOnInit(): void {
		this.displayTitle = this.data.name || "";
		this.displaySubtitle = this.data.formatted_address || this.data.vicinity || "";
	}
}
