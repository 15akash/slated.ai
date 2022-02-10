import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
	}
	navigateTo(path: string) {
		this.router.navigate(['../' + path], { relativeTo: this.route })
	}

}
