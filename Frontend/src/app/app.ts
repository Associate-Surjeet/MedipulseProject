import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showLayout = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateLayout(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.updateLayout(e.urlAfterRedirects || e.url);
      });
  }

  private updateLayout(url: string): void {
    const isPublicPage =
      url.startsWith('/login') ||
      url.startsWith('/register') ||
      url.startsWith('/pending-approval') ||
      url === '/';
    this.showLayout = this.authService.isAuthenticated && !isPublicPage;
  }
}
