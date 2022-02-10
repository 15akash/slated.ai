import { Component, Input, OnInit } from '@angular/core';
import { AssistantService, I_suggestionItem } from '../../services/assistant.service';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.component.html',
	styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

	@Input() suggestions: I_suggestionItem[] = [];
	constructor(
		private assistantService: AssistantService
	) {
		this.getSuggestions();
	}

	ngOnInit(): void {
		// this.assistantService.insertNotification({
		// 	title: 'Welcome', displayHTML: "Watch this space for suggestions", type: "intro", status: "active",
		// 	btns: [{ _id: 'dismiss', displayText: "Dismiss", color: 'yellow' }]
		// });
		// this.assistantService.insertNotification({
		// 	title: 'Welcome', displayHTML: "Watch this space for suggestions", type: "intro", status: "active",
		// 	btns: [{ _id: 'dismiss', displayText: "Dismiss", color: 'yellow' }, { _id: 'remindLater', displayText: "Remind later", color: "white" }]
		// });

		//this.assistantService.deleteNotification({ type: "intro", statusFields: ["active"] });
	}

	getSuggestions() {
		this.assistantService.getIntroSuggestions().subscribe(r => {
			if (r.status == 'success') {
				this.suggestions = r.data;
			}
		}, e => { });
	}
	deleteSuggestion(item: I_suggestionItem) {
		let t: I_suggestionItem[] = [], list = this.suggestions;
		for (let i = 0, len = list.length; i < len; i++) {
			if (item._id != list[i]._id) t.push(list[i]);
		}
		this.suggestions = t;
	}

	onAction(e: any) {
		const { source, btnItem, data } = e;
		if (source == 'close') {
			this.dismiss(data);
		} else {
			switch (btnItem._id) {
				case 'dismiss': this.dismiss(data); break;
				case 'remindLater': this.remindLater(data); break;
			}
		}
	}
	dismiss(data: I_suggestionItem) {
		this.deleteSuggestion(data);
		this.assistantService.dismissNotification(data).then((r: any) => {
			this.getSuggestions();
		});
	}
	remindLater(data: I_suggestionItem) {
		this.deleteSuggestion(data);
		this.assistantService.remindLaterNotification(data).then(r => {
			this.getSuggestions();
		});
	}
}
