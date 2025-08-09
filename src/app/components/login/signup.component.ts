import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = {
    firstName: '',
    lastName: '',
    mobile: '',
    username: '',
    email: '',
    password: ''
  };
  error: string = '';
  showVerification: boolean = false;
  verificationCode: string = '';

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {}

  signup() {
    this.error = '';
    this.cognitoService.signUp(this.user).subscribe({
      next: (result) => {
        if (result) {
          // Redirect to verification page with username
          this.router.navigate(['/verify'], {
            queryParams: { username: this.user.username }
          });
        }
      },
      error: (err) => {
        this.error = err.message || 'Signup failed';
      }
    });
  }
}
