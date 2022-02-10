import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { patternValidator } from '@core/utils/pattern.validator';
import { MyErrorStateMatcher, MyErrorStateMatcher2 } from '@core/utils/errormatcher';
import { PasswordValidator } from '@core/utils/password.validator';
import { LocalStorageService } from '@core/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss']
})
export class EnterPasswordComponent implements OnInit {
  public loginForm: FormGroup;
  errorMatcher = new MyErrorStateMatcher();
  errorMatcher2 = new MyErrorStateMatcher2();
  showingPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private lsService: LocalStorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), patternValidator('invalidPassword', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]]
    });
  }
  get glf() { return this.loginForm.controls; }

  ngOnInit(): void {
    console.log(this.lsService.getTemp());
    let email = this.lsService.getTemp()?.email;
    if (email) this.loginForm.patchValue({ email });
    else this.router.navigate(['login']);
  }
  startLogin(): void {
    console.log('startLogin', this.loginForm.value);
  }
  startOTP(): void {
    console.log('startOTP', this.loginForm.value);
    this.router.navigate(['login/enter-code']);
  }
  navigateTo(path: string): void {
    this.lsService.storeTemp({ ...this.loginForm.value, fromPage: 'enter-password' });
    this.router.navigate([path])
  }
}
