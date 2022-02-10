import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-speech-bubble',
	templateUrl: './speech-bubble.component.html',
	styleUrls: ['./speech-bubble.component.scss']
})
export class SpeechBubbleComponent implements OnInit {
	@Input() btnText: string = '';
	@Input() contentText: string = 'Watch this space for suggestions & notifications';

	constructor() { }

	ngOnInit(): void {
	}

}
