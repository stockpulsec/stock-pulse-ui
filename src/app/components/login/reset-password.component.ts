import { Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  username: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  error: string = '';
  success: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cognitoService: CognitoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (!this.username) {
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  resetPassword() {
    if (!this.verificationCode || !this.newPassword || this.isLoading) return;

    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.cognitoService.resetPassword(this.username, this.verificationCode, this.newPassword).subscribe({
      next: () => {
        this.success = 'Password has been reset successfully!';
        this.isLoading = false;
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to reset password.';
        this.isLoading = false;
      }
    });
  }
}
