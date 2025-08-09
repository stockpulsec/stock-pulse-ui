import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {}

  login() {
    this.error = '';
    this.cognitoService.signIn(this.username, this.password).subscribe({
      next: () => {
        // After successful login, navigate to stock-list
        this.router.navigate(['/stock-list']);
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
      }
    });
  }
}
