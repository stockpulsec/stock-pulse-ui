import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthPage: boolean = false;

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {}
  
  ngOnInit(): void {
    // Check initial route
    this.checkIfAuthPage(this.router.url);
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkIfAuthPage(event.url);
    });
  }
  
  private checkIfAuthPage(url: string): void {
    // Check if the current route is a login-related page
    this.isAuthPage = url.includes('/login') || 
                      url.includes('/signup') || 
                      url.includes('/verify') || 
                      url.includes('/forgot-password') ||
                      url.includes('/reset-password');
  }

  onLogout() {
    this.cognitoService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
      }
    });
  }
}
