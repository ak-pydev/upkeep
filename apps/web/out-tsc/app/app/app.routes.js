import { authGuard } from './core/guards/auth.guard';
import { ownerGuard } from './core/guards/role.guard';
export const APP_ROUTES = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'onboarding',
        canActivate: [authGuard],
        loadComponent: () => import('./features/auth/onboarding.component').then((m) => m.OnboardingComponent),
    },
    {
        path: 'app',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/components/shell.component').then((m) => m.ShellComponent),
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: 'chat',
                loadComponent: () => import('./features/chat/chat.component').then((m) => m.ChatComponent),
            },
            {
                path: 'chat/:threadId',
                loadComponent: () => import('./features/chat/chat.component').then((m) => m.ChatComponent),
            },
            {
                path: 'manuals',
                loadComponent: () => import('./features/manuals/manuals.component').then((m) => m.ManualsComponent),
            },
            {
                path: 'tickets',
                loadComponent: () => import('./features/tickets/tickets.component').then((m) => m.TicketsComponent),
            },
            {
                path: 'alerts',
                loadComponent: () => import('./features/alerts/alerts.component').then((m) => m.AlertsComponent),
            },
            {
                path: 'history',
                loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent),
            },
            {
                path: 'settings',
                canActivate: [ownerGuard],
                loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent),
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
