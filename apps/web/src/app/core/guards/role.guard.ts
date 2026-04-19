import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const ownerGuard: CanActivateFn = () => {
  const svc = inject(AuthService);
  const router = inject(Router);
  return svc.hasRole('owner') ? true : router.parseUrl('/app/dashboard');
};

export const supervisorGuard: CanActivateFn = () => {
  const svc = inject(AuthService);
  const router = inject(Router);
  return svc.hasRole('owner', 'supervisor') ? true : router.parseUrl('/app/dashboard');
};
