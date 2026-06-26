import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { email, form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { ISignupModel } from '@core/model/auth.model';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormField, FormRoot],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);

  private signupModel = signal<ISignupModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  protected signupForm = form(
    this.signupModel,
    (schemaPath) => {
      required(schemaPath.firstName, { message: 'First name is required' });
      required(schemaPath.lastName, { message: 'Last name is required' });
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { error: { kind: 'email', message: 'Enter a valid email address' } });
      required(schemaPath.password, { message: 'Password is required' });
      minLength(schemaPath.password, 8, { error: { kind: 'minLength', message: 'Password must be at least 8 characters' } });
      required(schemaPath.confirmPassword, { message: 'Please confirm your password' });
      validate(schemaPath.confirmPassword, ({ value, valueOf }) =>
        value() && value() !== valueOf(schemaPath.password)
          ? { kind: 'mismatch', message: 'Passwords do not match' }
          : undefined
      );
      validate(schemaPath.terms, ({ value }) =>
        !value() ? { kind: 'required', message: 'You must accept the terms and conditions' } : undefined
      );
    },
    {
      submission: {
        action: async (field) => {
          await this.signupSubmit(field().value());
        },
      },
    },
  );

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  protected async signupSubmit(data: ISignupModel): Promise<void> {
    console.log('Sign up submitted:', data);
    // TODO: call auth service
  }
}
