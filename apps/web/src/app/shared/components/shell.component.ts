import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav
        #drawer
        class="sidenav"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <div class="drawer-shell">
          <div class="brand-lockup">
            <span class="logo">U</span>
            <div class="brand-copy">
              <span class="name">Upkeep</span>
              <span class="tag">Operations workspace</span>
            </div>
          </div>

          <mat-nav-list class="nav-list">
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/dashboard"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/chat"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>forum</mat-icon>
              <span matListItemTitle>Ask Upkeep</span>
            </a>
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/manuals"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>menu_book</mat-icon>
              <span matListItemTitle>Manuals</span>
            </a>
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/tickets"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>build</mat-icon>
              <span matListItemTitle>Tickets</span>
            </a>
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/alerts"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>notifications_active</mat-icon>
              <span matListItemTitle>Alerts</span>
            </a>
            <a
              mat-list-item
              class="nav-item"
              routerLink="/app/history"
              routerLinkActive="active"
              (click)="closeDrawer(drawer)"
            >
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>History</span>
            </a>
            @if (auth.hasRole('owner')) {
              <a
                mat-list-item
                class="nav-item"
                routerLink="/app/settings"
                routerLinkActive="active"
                (click)="closeDrawer(drawer)"
              >
                <mat-icon matListItemIcon>settings</mat-icon>
                <span matListItemTitle>Settings</span>
              </a>
            }
          </mat-nav-list>

          <div class="drawer-footer">
            <span class="footer-label">Signed in</span>
            <strong>{{ auth.user()?.email || '—' }}</strong>
            <span class="footer-muted">Role: {{ auth.claims().role || '—' }}</span>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="shell-content">
        <mat-toolbar class="toolbar">
          @if (isHandset()) {
            <button mat-icon-button class="menu-button" (click)="drawer.toggle()" aria-label="Menu">
              <mat-icon>menu</mat-icon>
            </button>
          }
          @if (isHandset()) {
            <div class="toolbar-brand">
              <span class="logo">U</span>
              <div class="toolbar-copy">
                <span class="name">Upkeep</span>
                <span class="tag">Operations workspace</span>
              </div>
            </div>
          }
          @if (!isHandset()) {
            <div class="toolbar-badges">
              <span class="surface-pill">Dashboard</span>
              <span class="surface-pill">{{ auth.claims().role || 'unassigned' }}</span>
            </div>
          }
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="user" aria-label="Account">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #user="matMenu">
            <button mat-menu-item disabled>{{ auth.user()?.email || '—' }}</button>
            <button mat-menu-item disabled>Role: {{ auth.claims().role || '—' }}</button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Sign out
            </button>
          </mat-menu>
        </mat-toolbar>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .container {
        min-height: 100dvh;
        background:
          radial-gradient(circle at top left, rgba(129, 166, 198, 0.14), transparent 34%),
          linear-gradient(180deg, #fbf8f4 0%, #f3ede5 100%);
      }

      .sidenav {
        width: min(88vw, 292px);
        background: linear-gradient(180deg, #fbf8f4 0%, #f3ede5 100%);
        border-right: 1px solid rgba(129, 166, 198, 0.24);
      }

      .drawer-shell {
        min-height: 100%;
        display: grid;
        gap: 18px;
        padding: 18px 14px 16px;
      }

      .brand-lockup,
      .drawer-footer,
      .nav-item {
        border: 1px solid rgba(129, 166, 198, 0.18);
        background: rgba(255, 255, 255, 0.72);
        box-shadow: 0 18px 40px rgba(82, 110, 130, 0.08);
      }

      .brand-lockup {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 20px;
      }

      .logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 14px;
        background: linear-gradient(135deg, #81a6c6 0%, #aacddc 100%);
        color: #17324a;
        font-weight: 700;
        flex: none;
      }

      .brand-copy,
      .toolbar-copy {
        display: grid;
        gap: 2px;
      }

      .name {
        font-weight: 700;
        font-size: 17px;
        letter-spacing: -0.02em;
      }

      .tag,
      .footer-label,
      .footer-muted {
        font-size: 12px;
        color: #60707c;
      }

      .nav-list {
        display: grid;
        gap: 10px;
        padding-top: 0;
      }

      .nav-item {
        min-height: 52px;
        padding: 10px 12px;
        border-radius: 16px;
        color: #233748;
        transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
      }

      .nav-item:hover,
      .nav-item.active {
        border-color: rgba(129, 166, 198, 0.45);
        background: #fff;
        transform: translateY(-1px);
        box-shadow: 0 20px 42px rgba(82, 110, 130, 0.12);
      }

      .nav-item .mat-icon {
        color: #5f7f95;
      }

      .drawer-footer {
        display: grid;
        gap: 4px;
        margin-top: auto;
        padding: 14px;
        border-radius: 18px;
      }

      .shell-content {
        min-height: 100dvh;
      }

      .toolbar {
        position: sticky;
        top: 0;
        z-index: 6;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 72px;
        padding: 12px 18px;
        background: rgba(251, 248, 244, 0.84);
        backdrop-filter: blur(18px);
        border-bottom: 1px solid rgba(129, 166, 198, 0.18);
      }

      .toolbar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .toolbar-badges {
        display: none;
        gap: 10px;
        margin-left: 8px;
      }

      .surface-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(243, 227, 208, 0.66);
        border: 1px solid rgba(210, 196, 180, 0.62);
        color: #5f4d3f;
        font-size: 12px;
      }

      .menu-button {
        margin-right: 2px;
      }

      .spacer {
        flex: 1;
      }

      .content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 18px 16px 28px;
      }

      @media (min-width: 900px) {
        .toolbar-badges {
          display: flex;
        }

        .content {
          padding: 24px;
        }

        .drawer-shell {
          padding: 20px 16px 18px;
        }
      }

      @media (max-width: 899px) {
        .toolbar {
          gap: 10px;
          min-height: 68px;
          padding-inline: 12px;
        }

        .toolbar-brand {
          flex: 1;
        }

        .toolbar-copy .name {
          font-size: 15px;
        }

        .toolbar-copy .tag {
          font-size: 11px;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly bp = inject(BreakpointObserver);
  readonly isHandset = toSignal(
    this.bp.observe([Breakpoints.Handset, Breakpoints.XSmall]).pipe(map((r) => r.matches)),
    { initialValue: typeof window !== 'undefined' ? window.matchMedia('(max-width: 599.98px)').matches : false }
  );

  closeDrawer(drawer: MatSidenav): void {
    if (this.isHandset()) {
      drawer.close();
    }
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
