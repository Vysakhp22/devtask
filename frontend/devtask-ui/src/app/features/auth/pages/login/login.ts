import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { LoginModel } from '../../../../core/model/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormField, FormRoot],
  styleUrl: './login.scss',
})
export class Login {
  readonly features = [
    'Kanban board with drag-and-drop',
    'Sprint burndown tracking',
    'Deploy to AWS in one push',
  ];

  showPassword = signal(false);
  forgotPasswordSent = signal(false);
  showErrorBanner = signal(false);

  loginModel = signal<LoginModel>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email, { message: 'Email is required' });
      required(schemaPath.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async (field) => {
          const result = await this.loginSubmit(field().value());
          if (result) return;
        },
      },
    },
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onForgotPassword(): void {
    this.forgotPasswordSent.set(true);
  }

  dismissError(): void {
    this.showErrorBanner.set(false);
  }

  async loginSubmit(data: LoginModel): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }
}
