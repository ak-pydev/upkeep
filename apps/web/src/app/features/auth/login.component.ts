import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
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
        <p class="eyebrow">Upkeep</p>
        <h1>Sign in to keep machines moving.</h1>
        <p class="lede">
          Use your email or Google account to access manuals, chat, tickets, and maintenance logs.
        </p>

        <div class="stats">
          <article>
            <strong>Fast access</strong>
            <span>Email and Google sign-in</span>
          </article>
          <article>
            <strong>Org aware</strong>
            <span>Claims drive access after onboarding</span>
          </article>
        </div>
      </section>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>{{ mode() === 'login' ? 'Welcome back' : 'Create your account' }}</mat-card-title>
          <mat-card-subtitle>
            {{
              mode() === 'login'
                ? 'Sign in with email or Google.'
                : 'Register your account first, then create an org.'
            }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="surface-note">
            <mat-icon>shield</mat-icon>
            <span>Secure access for maintenance, manuals, and team workflows.</span>
          </div>

          <button
            mat-stroked-button
            type="button"
            class="google"
            [disabled]="busy()"
            (click)="googleSignIn()"
          >
            @if (busy() === 'google') {
              <mat-progress-spinner diameter="18" mode="indeterminate" />
            } @else {
              <mat-icon>google</mat-icon>
            }
            Continue with Google
          </button>

          <mat-divider class="divider" />

          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              @if (email.invalid && email.touched) {
                <mat-error>Enter a valid email address.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                autocomplete="current-password"
              />
              @if (password.invalid && password.touched) {
                <mat-error>Password must be at least 8 characters.</mat-error>
              }
            </mat-form-field>

            @if (mode() === 'register') {
              <mat-form-field appearance="outline">
                <mat-label>Confirm password</mat-label>
                <input
                  matInput
                  type="password"
                  formControlName="confirmPassword"
                  autocomplete="new-password"
                />
                @if (confirmPassword.invalid && confirmPassword.touched) {
                  <mat-error>Passwords must match.</mat-error>
                }
              </mat-form-field>
            }

            @if (error()) {
              <p class="error">{{ error() }}</p>
            }

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || !!busy()">
              @if (busy()) {
                <mat-progress-spinner diameter="18" mode="indeterminate" />
              } @else {
                <mat-icon>{{ mode() === 'login' ? 'login' : 'person_add' }}</mat-icon>
              }
              {{ mode() === 'login' ? 'Sign in' : 'Register' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button type="button" (click)="toggleMode()" [disabled]="!!busy()">
            {{ mode() === 'login' ? 'Need an account? Register' : 'Already registered? Sign in' }}
          </button>
          <a mat-button routerLink="/">Back to landing</a>
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
          radial-gradient(circle at top left, rgba(129, 166, 198, 0.34), transparent 30%),
          radial-gradient(circle at bottom right, rgba(243, 227, 208, 0.82), transparent 28%),
          linear-gradient(180deg, #f8f4ec 0%, #eef3f6 100%);
      }

      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 20px;
      }

      .hero {
        margin-bottom: 18px;
        padding: 12px 2px 4px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        margin: 0 0 12px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        color: #55748d;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
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

      .stats {
        display: grid;
        gap: 12px;
        margin-top: 22px;
      }

      .stats article {
        padding: 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(130, 153, 171, 0.14);
        box-shadow: 0 10px 24px rgba(83, 98, 109, 0.06);
      }

      .stats strong {
        display: block;
        margin-bottom: 4px;
        color: #243447;
      }

      .stats span,
      .surface-note,
      .error {
        color: #617789;
      }

      .panel {
        overflow: hidden;
        margin-left: auto;
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

      .google,
      button[type='submit'] {
        width: 100%;
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 16px;
      }

      .google {
        background: rgba(255, 255, 255, 0.7);
      }

      .divider {
        margin: 6px 0 4px;
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

      .error {
        margin: 0;
        font-size: 0.95rem;
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
          max-width: 640px;
          margin-bottom: 0;
          padding-top: 0;
        }

        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .panel {
          width: min(100%, 520px);
          margin-top: 12px;
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
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly mode = signal<'login' | 'register'>('login');
  readonly busy = signal<'google' | 'submit' | null>(null);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: [''],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  toggleMode(): void {
    this.error.set('');
    this.mode.update((current) => (current === 'login' ? 'register' : 'login'));
    this.confirmPassword.setValidators(
      this.mode() === 'register' ? [Validators.required] : []
    );
    this.confirmPassword.setErrors(null);
    this.confirmPassword.updateValueAndValidity();
  }

  async googleSignIn(): Promise<void> {
    this.error.set('');
    this.busy.set('google');
    try {
      await this.auth.loginWithGoogle();
      await this.router.navigateByUrl('/app/dashboard');
    } catch (err) {
      this.error.set(this.messageFromError(err, 'Google sign-in failed.'));
    } finally {
      this.busy.set(null);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.busy()) return;

    if (this.mode() === 'register' && this.password.value !== this.confirmPassword.value) {
      this.confirmPassword.setErrors({ mismatch: true });
      this.error.set('Passwords must match.');
      this.confirmPassword.markAsTouched();
      return;
    }

    this.error.set('');
    this.busy.set('submit');
    const { email, password } = this.form.getRawValue();

    try {
      if (this.mode() === 'register') {
        await this.auth.registerWithEmail(email, password);
      } else {
        await this.auth.loginWithEmail(email, password);
      }
      await this.router.navigateByUrl('/app/dashboard');
    } catch (err) {
      this.error.set(this.messageFromError(err, 'Unable to complete authentication.'));
    } finally {
      this.busy.set(null);
    }
  }

  private messageFromError(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message;
    return fallback;
  }
}
