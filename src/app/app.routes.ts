


import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/login/signup.component';
import { ForgotPasswordComponent } from './components/login/forgot-password.component';
import { ResetPasswordComponent } from './components/login/reset-password.component';
import { StockListComponent } from './components/stock-pulse/stock-list.component';
import { VerificationComponent } from './components/login/verification.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify', component: VerificationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'stock-list', component: StockListComponent },
];
