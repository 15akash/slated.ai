import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { AssistantService, I_listItem } from '../../services/assistant.service';

@Component({
	selector: 'app-assistant',
	templateUrl: './assistant.component.html',
	styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit, OnChanges {

	@Input() view: string = 'intro';
	//@Input() view: string = 'person';
	//@Input() view: string = 'meeting';
	@Input() subView: string = '';

	@Input() meetingData!: I_meeting;

	title: string = 'SlatedAI Assistant';
	centerAlignTitle: boolean = false;
	showBack: boolean = false;

	isShowingMore: boolean = false;
	enableAutoClose: boolean = false;
	moreList: I_listItem[] = [];
	@Output() back = new EventEmitter();

	constructor(
		private assistantService: AssistantService
	) {
		this.moreList = this.assistantService.getMoreList(this.view);
		this.title = this.assistantService.getTitle(this.view);
		this.showBack = ['person', 'meeting'].indexOf(this.view) >= 0 ? true : false;
	}

	ngOnInit(): void {
		this.updateTitle();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.view) {
			this.view = changes.view.currentValue;
			this.updateTitle();
		}
	}
	updateTitle(): void {
		switch (this.view) {
			case 'person': this.centerAlignTitle = true; this.showBack = true; this.title = 'Person'; break;
			case 'meeting': this.centerAlignTitle = true; this.showBack = true; this.title = this.meetingData.name || 'Meeting title'; break;
			case 'intro': this.centerAlignTitle = false; this.showBack = false; this.title = 'SlatedAI assistant'; break;
		}
	}

	showMoreList(): void {
		document.addEventListener('click', this.onOutsideClick);
		Promise.resolve().then(() => {
			this.isShowingMore = true;
			this.enableAutoClose = false;
			setTimeout(() => {
				this.enableAutoClose = true;
			}, 300);
		});
	}
	closeMoreList(): void {
		this.isShowingMore = false;
		document.removeEventListener('click', this.onOutsideClick);
	}
	onOutsideClick = (e: MouseEvent): any => {
		if (this.isShowingMore && this.enableAutoClose) {
			this.enableAutoClose = false;
			this.closeMoreList();
		}
	}
	onMoreItemClick(item: I_listItem): void {
		this.closeMoreList();
	}
	onBackClick(): void {
		this.back.emit({ view: this.view });
	}

}

