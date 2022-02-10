import { AbstractControl, ValidatorFn } from "@angular/forms";

export function nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const forbidden = /admin/.test(control.value);
    return forbidden ? { 'forbiddenName': { value: control.value } } : null;
}

export function patternValidator(patternName: string, pattern: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const flag = !pattern.test(control.value);
        return flag ? { [patternName]: { value: control.value } } : null;
    }
}