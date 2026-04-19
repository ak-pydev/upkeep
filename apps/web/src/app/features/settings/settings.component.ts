import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Organization</p>
          <h1>Settings</h1>
          <p class="lede">Current auth and org state for the active account.</p>
        </div>
        <div class="summary">
          <article class="stat">
            <span class="label">Role</span>
            <strong>{{ auth.claims().role || 'unassigned' }}</strong>
          </article>
          <article class="stat">
            <span class="label">Org ID</span>
            <strong>{{ auth.claims().orgId || profile()?.orgId || 'none' }}</strong>
          </article>
        </div>
      </header>

      <div class="layout">
        <section class="panel">
          <div class="panel-head">
            <h2>Account</h2>
            <button type="button" class="button secondary" (click)="refresh()">Refresh</button>
          </div>

          <div class="info-grid">
            <div>
              <span class="label">Email</span>
              <strong>{{ auth.user()?.email || 'unknown' }}</strong>
            </div>
            <div>
              <span class="label">Display name</span>
              <strong>{{ auth.user()?.displayName || 'not set' }}</strong>
            </div>
            <div>
              <span class="label">Needs org</span>
              <strong>{{ profile()?.needsOrg ? 'yes' : 'no' }}</strong>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="button secondary" (click)="auth.refreshClaims()">Refresh claims</button>
            <button type="button" class="button secondary" (click)="logout()">Sign out</button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Organization</h2>
            <span>{{ profile()?.name || 'current workspace' }}</span>
          </div>

          @if (loading()) {
            <p class="empty">Loading org info...</p>
          } @else if (error()) {
            <p class="empty error">{{ error() }}</p>
          } @else if (profile()?.needsOrg) {
            <form class="form" (ngSubmit)="createOrg()">
              <label>
                Organization name
                <input [(ngModel)]="orgName" name="orgName" placeholder="Acme Machine Shop" required />
              </label>
              <button type="submit" class="button" [disabled]="working()">
                Create organization
              </button>
            </form>
          } @else {
            <div class="info-grid">
              <div>
                <span class="label">Org status</span>
                <strong>Connected</strong>
              </div>
              <div>
                <span class="label">Backend org ID</span>
                <strong>{{ profile()?.orgId || 'pending sync' }}</strong>
              </div>
              <div>
                <span class="label">Server role</span>
                <strong>{{ profile()?.role || 'pending sync' }}</strong>
              </div>
            </div>
          }
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 16px;
      }
      .hero,
      .panel,
      .stat {
        border: 1px solid var(--upkeep-border);
        border-radius: 16px;
        background: white;
      }
      .hero,
      .panel {
        padding: 16px;
      }
      .hero {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }
      .summary,
      .layout,
      .info-grid,
      .actions,
      .form {
        display: grid;
        gap: 12px;
      }
      .layout {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
      .summary {
        min-width: 240px;
      }
      .stat {
        padding: 14px;
      }
      .panel-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }
      .label,
      .eyebrow,
      .lede,
      .empty {
        color: #6b7280;
        font-size: 12px;
      }
      .info-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .actions {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        margin-top: 16px;
      }
      label {
        display: grid;
        gap: 6px;
      }
      input {
        border: 1px solid var(--upkeep-border);
        border-radius: 10px;
        padding: 10px 12px;
        font: inherit;
        background: white;
      }
      .button {
        border: 0;
        border-radius: 999px;
        padding: 10px 14px;
        background: var(--upkeep-primary);
        color: white;
        cursor: pointer;
      }
      .button.secondary {
        background: #e5e7eb;
        color: #111827;
      }
      .empty.error {
        color: #b91c1c;
      }
      @media (max-width: 760px) {
        .hero,
        .layout {
          grid-template-columns: 1fr;
          flex-direction: column;
        }
        .summary {
          min-width: 0;
        }
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly working = signal(false);
  readonly error = signal<string | null>(null);
  readonly profile = signal<{ orgId?: string; role?: string; needsOrg?: boolean; name?: string } | null>(
    null
  );
  orgName = '';

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .me()
      .pipe(
        catchError(() => {
          this.error.set('Could not load organization settings.');
          return of({ orgId: undefined, role: undefined, needsOrg: true, name: undefined });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((result) => {
        this.profile.set(result);
        this.orgName = result.name || this.orgName;
      });
  }

  createOrg(): void {
    if (!this.orgName.trim()) {
      return;
    }
    this.working.set(true);
    this.api
      .createOrg(this.orgName.trim())
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: (result) => {
          this.profile.set({
            ...(this.profile() ?? {}),
            orgId: result.orgId,
            needsOrg: false,
            name: this.orgName.trim(),
          });
          void this.auth.refreshClaims();
        },
        error: () => this.error.set('Could not create the organization.'),
      });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
