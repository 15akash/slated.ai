import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { I_btnItem, I_suggestionItem } from '../../services/assistant.service';

@Component({
	selector: 'app-suggestion',
	templateUrl: './suggestion.component.html',
	styleUrls: ['./suggestion.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SuggestionComponent implements OnInit {

	@Input() suggestion: I_suggestionItem = { title: "", displayHTML: "", type: "", status: "" };
	@Input() last: boolean = false;
	btns: I_btnItem[] = [{ _id: "dismiss", displayText: "Dismiss", color: 'yellow' }];

	@Output() btnAction = new EventEmitter();
	constructor() { }

	ngOnInit(): void {
		if (this.suggestion.btns) this.btns = this.suggestion.btns
	}
	onClickBtn(item: I_btnItem) {
		this.btnAction.emit({ source: 'btn', btnItem: item, data: this.suggestion });
	}
	onClickClose(e: MouseEvent) {
		this.btnAction.emit({ source: 'close', data: this.suggestion });
	}

}
