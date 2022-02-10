import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-back-btn',
	templateUrl: './back-btn.component.html',
	styleUrls: ['./back-btn.component.scss']
})
export class BackBtnComponent implements OnInit {

	@Input() hideTxt: boolean = false;
	constructor() { }

	ngOnInit(): void {
	}

}
