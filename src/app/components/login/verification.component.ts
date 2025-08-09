import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  verificationForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  username = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cognitoService: CognitoService
  ) {
    this.verificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (!this.username) {
        this.router.navigate(['/signup']);
      }
    });
  }

  onSubmit() {
    if (this.verificationForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const code = this.verificationForm.get('code')?.value;
      this.cognitoService.confirmSignUp(this.username, code).subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { verified: 'true' }
          });
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'Verification failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
}
