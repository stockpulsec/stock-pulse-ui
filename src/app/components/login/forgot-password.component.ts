import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  username: string = '';
  error: string = '';
  success: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {}

  requestCode() {
    if (!this.username || this.isLoading) return;

    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.cognitoService.forgotPassword(this.username).subscribe({
      next: () => {
        this.success = 'Verification code has been sent to your email.';
        this.isLoading = false;
        // Redirect to reset password page
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { username: this.username }
          });
        }, 1500);
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to send verification code.';
        this.isLoading = false;
      }
    });
  }
}
