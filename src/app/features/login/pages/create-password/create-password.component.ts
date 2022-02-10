import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { patternValidator } from '@core/utils/pattern.validator';
import { MyErrorStateMatcher, MyErrorStateMatcher2, MyErrorStateMatcher3 } from '@core/utils/errormatcher';
import { PasswordValidator } from '@core/utils/password.validator';
import { LocalStorageService } from '@core/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-create-password',
	templateUrl: './create-password.component.html',
	styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {
	public loginForm: FormGroup;
	errorMatcher = new MyErrorStateMatcher();
	errorMatcher2 = new MyErrorStateMatcher2();
	errorMatcher3 = new MyErrorStateMatcher3();
	showingPassword: boolean = false;
	showingConfirmPassword: boolean = false;
	passwordCondition1: boolean = false;
	passwordCondition2: boolean = false;
	passwordCondition3: boolean = false;
	@ViewChild('name') name!: ElementRef;

	constructor(
		private fb: FormBuilder,
		private lsService: LocalStorageService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			name: ['', [Validators.required]],
			password: ['', [
				Validators.required, Validators.minLength(8),
				patternValidator('invalidPassword', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$&+,:;=?@#|'<>.^*()%!-]).{8,}$/),
				patternValidator('invalidPassword_missingNumber', /[0-9]/),
				patternValidator('invalidPassword_missingSpecial', /[$&+,:;=?@#|'<>.^*()%!-]/),
			]],
			//confirmPassword: ['', [Validators.required, Validators.minLength(8), patternValidator('invalidPassword', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$&+,:;=?@#|'<>.^*()%!-]).{8,}$/)]],
		}, {
			//validators: [PasswordValidator.validate]
		});
	}
	get glf() { return this.loginForm.controls; }

	ngOnInit(): void {
		console.log(this.lsService.getTemp());
		let email = this.lsService.getTemp()?.email;
		if (email) this.loginForm.patchValue({ email });
		else this.router.navigate(['login']);
		setTimeout(() => {
			if (this.name) this.name.nativeElement.focus();
		}, 0)
	}
	startLogin(): void {
		console.log('startLogin', this.loginForm.value);
	}
	startOTP(): void {
		console.log('startOTP', this.loginForm.value);
		this.router.navigate(['login/enter-code']);
	}
	navigateTo(path: string): void {
		this.lsService.storeTemp({ fromPage: 'create-password' });
		this.router.navigate(['login'])
	}

}
