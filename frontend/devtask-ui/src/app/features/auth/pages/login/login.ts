import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
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

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onForgotPassword(): void {
    this.forgotPasswordSent.set(true);
  }

  dismissError(): void {
    this.showErrorBanner.set(false);
  }
}
