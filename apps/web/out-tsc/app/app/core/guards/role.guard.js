import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
export const ownerGuard = () => {
    const svc = inject(AuthService);
    const router = inject(Router);
    return svc.hasRole('owner') ? true : router.parseUrl('/app/dashboard');
};
export const supervisorGuard = () => {
    const svc = inject(AuthService);
    const router = inject(Router);
    return svc.hasRole('owner', 'supervisor') ? true : router.parseUrl('/app/dashboard');
};
