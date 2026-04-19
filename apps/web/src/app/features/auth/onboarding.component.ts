import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="shell">
      <section class="hero">
        <div>
          <p class="eyebrow">Onboarding</p>
          <h1>Set up your organization.</h1>
          <p class="lede">
            Create the org record that scopes machines, manuals, alerts, tickets, and claims.
          </p>
        </div>

        <div class="callouts">
          <article>
            <mat-icon>domain</mat-icon>
            <div>
              <strong>Org first</strong>
              <span>Required before the app shell opens</span>
            </div>
          </article>
          <article>
            <mat-icon>verified_user</mat-icon>
            <div>
              <strong>Claims refresh</strong>
              <span>We refresh your Firebase token after creation</span>
            </div>
          </article>
          <article>
            <mat-icon>fact_check</mat-icon>
            <div>
              <strong>Clean handoff</strong>
              <span>Return to the dashboard once org context is ready</span>
            </div>
          </article>
        </div>
      </section>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>Create your organization</mat-card-title>
          <mat-card-subtitle>
            {{ auth.user()?.email || 'Signed-in user' }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="surface-note">
            <mat-icon>warehouse</mat-icon>
            <span>Use a clear company or plant name so machine context stays easy to scan on mobile.</span>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>Organization name</mat-label>
              <input
                matInput
                formControlName="name"
                placeholder="Acme Manufacturing"
                autocomplete="organization"
              />
              @if (name.invalid && name.touched) {
                <mat-error>Organization name is required.</mat-error>
              }
            </mat-form-field>

            @if (error()) {
              <p class="error">{{ error() }}</p>
            }

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || !!busy()">
              @if (busy()) {
                <mat-progress-spinner diameter="18" mode="indeterminate" />
              } @else {
                <mat-icon>domain_add</mat-icon>
              }
              Create org
            </button>
          </form>

          <mat-divider class="divider" />

          <p class="hint">
            Already have an organization? If your claims are stale, use the refresh action after the backend
            has assigned them.
          </p>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button type="button" [disabled]="!!busy()" (click)="refreshClaims()">
            Refresh claims
          </button>
          <a mat-button routerLink="/login">Back to login</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        color: #243447;
        background:
          radial-gradient(circle at top right, rgba(129, 166, 198, 0.32), transparent 28%),
          radial-gradient(circle at bottom left, rgba(243, 227, 208, 0.86), transparent 30%),
          linear-gradient(180deg, #f8f4ec 0%, #eef3f6 100%);
      }

      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 20px;
      }

      .hero {
        display: grid;
        gap: 18px;
        margin-bottom: 18px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        margin: 0 0 12px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-size: 0.76rem;
        font-weight: 700;
        color: #55748d;
      }

      h1 {
        margin: 0;
        max-width: 12ch;
        font-size: clamp(2.6rem, 11vw, 5.2rem);
        line-height: 0.95;
        letter-spacing: -0.05em;
        color: #1e2c3a;
      }

      .lede {
        margin: 16px 0 0;
        max-width: 60ch;
        font-size: 1.05rem;
        line-height: 1.7;
        color: #556676;
      }

      .callouts {
        display: grid;
        gap: 12px;
        margin-top: 22px;
      }

      .callouts article {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(130, 153, 171, 0.14);
        box-shadow: 0 10px 24px rgba(83, 98, 109, 0.06);
      }

      .callouts mat-icon {
        color: #6b87a0;
      }

      .callouts strong {
        display: block;
        margin-bottom: 4px;
        color: #243447;
      }

      .callouts span,
      .hint,
      .surface-note,
      .error {
        color: #617789;
        line-height: 1.6;
      }

      .panel {
        margin-left: auto;
        overflow: hidden;
        border-radius: 28px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.78)),
          linear-gradient(145deg, rgba(170, 205, 220, 0.18), rgba(243, 227, 208, 0.18));
        border: 1px solid rgba(129, 166, 198, 0.18);
        box-shadow: 0 28px 80px rgba(83, 98, 109, 0.14);
      }

      mat-card-header {
        padding-bottom: 8px;
      }

      mat-card-title {
        font-size: 1.6rem;
        color: #1e2c3a;
      }

      mat-card-subtitle {
        color: #617789;
      }

      mat-card-content {
        display: grid;
        gap: 14px;
      }

      .surface-note {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(243, 227, 208, 0.55);
        border: 1px solid rgba(195, 177, 154, 0.32);
      }

      .surface-note mat-icon {
        color: #6d5a42;
      }

      .surface-note span {
        line-height: 1.5;
      }

      .form {
        display: grid;
        gap: 14px;
      }

      mat-form-field {
        width: 100%;
      }

      :host ::ng-deep .mat-mdc-text-field-wrapper {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
      }

      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        padding-inline: 2px;
      }

      button[type='submit'] {
        width: 100%;
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 16px;
      }

      .divider {
        margin: 6px 0 4px;
      }

      .error {
        margin: 0;
        font-size: 0.95rem;
      }

      .hint {
        margin: 0;
      }

      mat-card-actions {
        padding: 0 16px 16px;
        gap: 8px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      @media (min-width: 900px) {
        .shell {
          padding: 28px 32px 40px;
        }

        .hero {
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          align-items: center;
          gap: 28px;
          min-height: calc(100vh - 132px);
        }

        .panel {
          width: min(100%, 520px);
        }
      }

      @media (max-width: 899px) {
        .panel {
          width: 100%;
        }
      }

      @media (max-width: 479px) {
        mat-card-actions {
          justify-content: stretch;
        }

        mat-card-actions > * {
          flex: 1 1 100%;
        }
      }

    `,
  ],
})
export class OnboardingComponent {
  readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly busy = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  get name() {
    return this.form.controls.name;
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.busy()) return;

    this.busy.set(true);
    this.error.set('');

    try {
      const { name } = this.form.getRawValue();
      await firstValueFrom(this.api.createOrg(name));
      await this.auth.refreshClaims();
      await this.router.navigateByUrl('/app/dashboard');
    } catch (err) {
      this.error.set(this.messageFromError(err, 'Unable to create the organization.'));
    } finally {
      this.busy.set(false);
    }
  }

  async refreshClaims(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.refreshClaims();
      await this.router.navigateByUrl('/app/dashboard');
    } catch (err) {
      this.error.set(this.messageFromError(err, 'Unable to refresh claims.'));
    } finally {
      this.busy.set(false);
    }
  }

  private messageFromError(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message;
    return fallback;
  }
}
