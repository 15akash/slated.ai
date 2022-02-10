import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage.service';
import { MyErrorStateMatcher, MyErrorStateMatcher2 } from '@core/utils/errormatcher';

@Component({
	selector: 'app-enter-code',
	templateUrl: './enter-code.component.html',
	styleUrls: ['./enter-code.component.scss']
})
export class EnterCodeComponent implements OnInit {
	public loginForm: FormGroup;
	errorMatcher = new MyErrorStateMatcher();
	errorMatcher2 = new MyErrorStateMatcher2();
	viewState: string = 'login';
	resendTimer: any;
	resendCount = 60;
	@ViewChild('verificationCode') verificationCode!: ElementRef;

	constructor(
		private fb: FormBuilder,
		private lsService: LocalStorageService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.min(100000), Validators.max(999999)]],
		});
	}
	get glf() { return this.loginForm.controls; }

	ngOnInit(): void {
		this.startResendTimer();
		console.log(this.lsService.getTemp());
		let email = this.lsService.getTemp()?.email;
		if (email) this.loginForm.patchValue({ email });
		else this.router.navigate(['login']);
		setTimeout(() => {
			if (this.verificationCode) this.verificationCode.nativeElement.focus();
		}, 0);
	}
	// ngAfterViewChecked(): void {
	// 	// setTimeout(() => {
	// 	// 	if (this.verificationCode) this.verificationCode.nativeElement.focus();
	// 	// }, 0);
	// }
	startResendTimer(): void {
		this.resendTimer = setInterval(() => {
			if (this.resendCount > 0) {
				this.resendCount--;
				if (this.resendCount == 0) {
					clearInterval(this.resendTimer);
				}
			}
		}, 1000);
	}

	startLogin(): void {
		console.log('startLogin', this.loginForm.value);
	}
	changeViewState(viewState: string) {
		this.viewState = viewState;
	}
	startResend(): void {
		this.resendCount = 60;
		this.startResendTimer();
	}

}
