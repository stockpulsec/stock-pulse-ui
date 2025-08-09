import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cognitoService: CognitoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true') {
        this.successMessage = 'Account verified successfully! You can now log in.';
      }
    });
  }

  login() {
    this.error = '';
    this.successMessage = '';
    this.cognitoService.signIn(this.username, this.password).subscribe({
      next: (result) => {
        if (result.success) {
          // User is verified and logged in successfully
          this.router.navigate(['/stock-list']);
        } else if (result.requiresVerification) {
          // User is not verified, redirect to verification page
          this.router.navigate(['/verify'], {
            queryParams: { username: this.username }
          });
        }
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
      }
    });
  }
}
