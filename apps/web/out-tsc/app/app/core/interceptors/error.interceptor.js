import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
export const errorInterceptor = (req, next) => {
    const snack = inject(MatSnackBar);
    const router = inject(Router);
    return next(req).pipe(catchError((err) => {
        const msg = err.error?.message || err.message || 'Unexpected error';
        if (err.status === 401) {
            snack.open('Session expired — please sign in again.', 'Dismiss', { duration: 4000 });
            router.navigateByUrl('/login');
        }
        else if (err.status === 403) {
            snack.open('Permission denied: ' + msg, 'Dismiss', { duration: 4000 });
        }
        else if (err.status >= 500) {
            snack.open('Server error: ' + msg, 'Dismiss', { duration: 5000 });
        }
        else if (err.status >= 400) {
            snack.open(msg, 'Dismiss', { duration: 4000 });
        }
        return throwError(() => err);
    }));
};
