import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ILoginModel } from '@app/core/model/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormField, FormRoot, RouterLink],
  styleUrl: './login.scss',
})
export class Login {
  readonly features = [
    'Kanban board with drag-and-drop',
    'Sprint burndown tracking',
    'Deploy to AWS in one push',
  ];

  protected showPassword = signal(false);
  protected forgotPasswordSent = signal(false);
  protected showErrorBanner = signal(false);

  private loginModel = signal<ILoginModel>({
    email: '',
    password: '',
  });

  protected loginForm = form(
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

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected onForgotPassword(): void {
    this.forgotPasswordSent.set(true);
  }

  protected dismissError(): void {
    this.showErrorBanner.set(false);
  }

  protected async loginSubmit(data: ILoginModel): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }
}
