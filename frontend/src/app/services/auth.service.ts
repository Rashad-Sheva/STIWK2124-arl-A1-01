import { Injectable } from '@angular/core';

/**
 * Provides Basic Auth credentials for POST / PUT / DELETE requests.
 * Even though the current backend doesn't enforce Spring Security,
 * the frontend implements auth to satisfy Assignment 2 requirements.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERNAME = 'admin';
  private readonly PASSWORD = 'admin123';

  getAuthHeader(): string {
    return 'Basic ' + btoa(`${this.USERNAME}:${this.PASSWORD}`);
  }
}
