import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidator {
    static validate(control: AbstractControl): ValidationErrors | null {
        let password = control.get('password');
        let confirmPassword = control.get('confirmPassword');
        if (password?.pristine || confirmPassword?.pristine) { return null; }
        return password && confirmPassword && password.value !== confirmPassword?.value ? { 'misMatch': true } : null;
    }
}

export class PasswordValidator3 {
    static validate(control: AbstractControl): ValidationErrors | null {
        let password = control.get('newPassword');
        let confirmPassword = control.get('confirmNewPassword');
        if (password?.pristine || confirmPassword?.pristine) { return null; }
        return password && confirmPassword && password.value !== confirmPassword?.value ? { 'misMatch': true } : null;
    }
}