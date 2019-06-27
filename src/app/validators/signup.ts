import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

import { passwordPattern } from '../shared/password-pattern';

// Form validator - password must match regex pattern
export function PasswordPattern(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    return passwordPattern.test(control.value) ? null: {passwordInvalid: true};
  }
}

// Form validator - password and confirmation must match
export function PasswordMatch(): ValidatorFn {
  return (group: FormGroup): {[key: string]: any} | null => {
    const password = group.get('password');
    const confirmation = group.get('passwordConfirmation');
    if (!confirmation.value) {
      confirmation.setErrors({required: true});
    } else if (password.value != confirmation.value) {
      confirmation.setErrors({mismatch: true});
    }
    return null;
  }
}
