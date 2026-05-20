import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  showLayout = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Evaluate once immediately for the initial URL (covers page refresh)
    this.updateLayout(this.router.url);

    // Re-evaluate on every subsequent navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.updateLayout(e.urlAfterRedirects || e.url);
      });
  }

  private updateLayout(url: string): void {
    const isPublicPage =
      url.startsWith('/login') || url.startsWith('/register') || url === '/';
    this.showLayout = this.authService.isAuthenticated && !isPublicPage;
  }
}
