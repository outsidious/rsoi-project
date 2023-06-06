import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activeSectionId?: string;

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {}

  get sections() {
    const allSections = [
      { id: 'all_meetups', title: 'Hotels', url: 'hotels' },
      { id: 'my_meetups', title: 'My reservations', url: 'me' },
      //{ id: 'users', title: 'Пользователи', url: 'users', access: 'ADMIN' },
    ];
    /*return allSections.filter((section) => {
      return (
        !section.access ||
        this.authService.user?.roles.find((role) => {
          return role.name === section.access;
        })
      );
    });*/
    return allSections;
  }

  get isAuth(): boolean {
    return this.authService.user !== null;
  }

  ngOnInit(): void {
    this.getActiveSection();
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((event) => {
        this.getActiveSection();
      });
  }

  redirectToLogin(): void {
    location.replace('auth');
  }

  getActiveSection(): void {
    this.sections.forEach((section) => {
      if (this.location.path().endsWith(section.url))
        this.activeSectionId = section.id;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
