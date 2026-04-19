import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async (route, _state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const svc = inject(AuthService);

  const user = await firstValueFrom(authState(auth));
  if (!user) {
    return router.parseUrl('/login');
  }
  // If signed in but no org yet, push to onboarding
  await svc.refreshClaims();
  if (!svc.claims().orgId && route.routeConfig?.path !== 'onboarding') {
    return router.parseUrl('/onboarding');
  }
  return true;
};
