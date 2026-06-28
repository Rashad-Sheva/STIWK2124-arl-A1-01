import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="brand-icon">📚</span>
        <span class="brand-name">Accessible Reading List</span>
      </div>
      <div class="navbar-links">
        <a routerLink="/books" routerLinkActive="active">Books</a>
        <a routerLink="/books/new" class="btn-nav-add">+ Add Book</a>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
