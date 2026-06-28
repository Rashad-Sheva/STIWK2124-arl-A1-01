import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Attaches Basic Auth header automatically to all
 * POST, PUT, DELETE requests. GET requests stay open.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const writeMethods = ['POST', 'PUT', 'DELETE'];

  if (writeMethods.includes(req.method)) {
    const cloned = req.clone({
      setHeaders: { Authorization: auth.getAuthHeader() }
    });
    return next(cloned);
  }

  return next(req);
};
