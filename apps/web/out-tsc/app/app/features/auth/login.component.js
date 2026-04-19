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
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/divider";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/progress-spinner";
function LoginComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-progress-spinner", 7);
} }
function LoginComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1, "google");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Enter a valid email address.");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Password must be at least 8 characters.");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_42_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Passwords must match.");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 10)(1, "mat-label");
    i0.ɵɵtext(2, "Confirm password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 18);
    i0.ɵɵconditionalCreate(4, LoginComponent_Conditional_42_Conditional_4_Template, 2, 0, "mat-error");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.confirmPassword.invalid && ctx_r0.confirmPassword.touched ? 4 : -1);
} }
function LoginComponent_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function LoginComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-progress-spinner", 7);
} }
function LoginComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.mode() === "login" ? "login" : "person_add");
} }
export class LoginComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.fb = inject(FormBuilder);
        this.mode = signal('login', ...(ngDevMode ? [{ debugName: "mode" }] : []));
        this.busy = signal(null, ...(ngDevMode ? [{ debugName: "busy" }] : []));
        this.error = signal('', ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.form = this.fb.nonNullable.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: [''],
        });
    }
    get email() {
        return this.form.controls.email;
    }
    get password() {
        return this.form.controls.password;
    }
    get confirmPassword() {
        return this.form.controls.confirmPassword;
    }
    toggleMode() {
        this.error.set('');
        this.mode.update((current) => (current === 'login' ? 'register' : 'login'));
        this.confirmPassword.setValidators(this.mode() === 'register' ? [Validators.required] : []);
        this.confirmPassword.setErrors(null);
        this.confirmPassword.updateValueAndValidity();
    }
    async googleSignIn() {
        this.error.set('');
        this.busy.set('google');
        try {
            await this.auth.loginWithGoogle();
            await this.router.navigateByUrl('/app/dashboard');
        }
        catch (err) {
            this.error.set(this.messageFromError(err, 'Google sign-in failed.'));
        }
        finally {
            this.busy.set(null);
        }
    }
    async submit() {
        if (this.form.invalid || this.busy())
            return;
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
            }
            else {
                await this.auth.loginWithEmail(email, password);
            }
            await this.router.navigateByUrl('/app/dashboard');
        }
        catch (err) {
            this.error.set(this.messageFromError(err, 'Unable to complete authentication.'));
        }
        finally {
            this.busy.set(null);
        }
    }
    messageFromError(err, fallback) {
        if (err instanceof Error && err.message)
            return err.message;
        return fallback;
    }
    static { this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginComponent, selectors: [["app-login"]], decls: 53, vars: 14, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "stats"], [1, "panel"], ["mat-stroked-button", "", "type", "button", 1, "google", 3, "click", "disabled"], ["diameter", "18", "mode", "indeterminate"], [1, "divider"], [1, "form", 3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "type", "email", "formControlName", "email", "autocomplete", "email"], ["matInput", "", "type", "password", "formControlName", "password", "autocomplete", "current-password"], [1, "error"], ["mat-flat-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["align", "end"], ["mat-button", "", "type", "button", 3, "click", "disabled"], ["mat-button", "", "routerLink", "/"], ["matInput", "", "type", "password", "formControlName", "confirmPassword", "autocomplete", "new-password"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "p", 2);
            i0.ɵɵtext(3, "Upkeep");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Sign in to keep machines moving.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 3);
            i0.ɵɵtext(7, " Use your email or Google account to access manuals, chat, tickets, and maintenance logs. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 4)(9, "div")(10, "strong");
            i0.ɵɵtext(11, "Fast access");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "span");
            i0.ɵɵtext(13, "Email and Google sign-in");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div")(15, "strong");
            i0.ɵɵtext(16, "Org aware");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span");
            i0.ɵɵtext(18, "Claims drive access after onboarding");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(19, "mat-card", 5)(20, "mat-card-header")(21, "mat-card-title");
            i0.ɵɵtext(22);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "mat-card-subtitle");
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "mat-card-content")(26, "button", 6);
            i0.ɵɵlistener("click", function LoginComponent_Template_button_click_26_listener() { return ctx.googleSignIn(); });
            i0.ɵɵconditionalCreate(27, LoginComponent_Conditional_27_Template, 1, 0, "mat-progress-spinner", 7)(28, LoginComponent_Conditional_28_Template, 2, 0, "mat-icon");
            i0.ɵɵtext(29, " Continue with Google ");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(30, "mat-divider", 8);
            i0.ɵɵelementStart(31, "form", 9);
            i0.ɵɵlistener("ngSubmit", function LoginComponent_Template_form_ngSubmit_31_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(32, "mat-form-field", 10)(33, "mat-label");
            i0.ɵɵtext(34, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(35, "input", 11);
            i0.ɵɵconditionalCreate(36, LoginComponent_Conditional_36_Template, 2, 0, "mat-error");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "mat-form-field", 10)(38, "mat-label");
            i0.ɵɵtext(39, "Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(40, "input", 12);
            i0.ɵɵconditionalCreate(41, LoginComponent_Conditional_41_Template, 2, 0, "mat-error");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(42, LoginComponent_Conditional_42_Template, 5, 1, "mat-form-field", 10);
            i0.ɵɵconditionalCreate(43, LoginComponent_Conditional_43_Template, 2, 1, "p", 13);
            i0.ɵɵelementStart(44, "button", 14);
            i0.ɵɵconditionalCreate(45, LoginComponent_Conditional_45_Template, 1, 0, "mat-progress-spinner", 7)(46, LoginComponent_Conditional_46_Template, 2, 1, "mat-icon");
            i0.ɵɵtext(47);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(48, "mat-card-actions", 15)(49, "button", 16);
            i0.ɵɵlistener("click", function LoginComponent_Template_button_click_49_listener() { return ctx.toggleMode(); });
            i0.ɵɵtext(50);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "a", 17);
            i0.ɵɵtext(52, "Back to landing");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(22);
            i0.ɵɵtextInterpolate(ctx.mode() === "login" ? "Welcome back" : "Create your account");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.mode() === "login" ? "Sign in with email or Google." : "Register your account first, then create an org.", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.busy());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.busy() === "google" ? 27 : 28);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.email.invalid && ctx.email.touched ? 36 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.password.invalid && ctx.password.touched ? 41 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.mode() === "register" ? 42 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error() ? 43 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.form.invalid || !!ctx.busy());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.busy() ? 45 : 46);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.mode() === "login" ? "Sign in" : "Register", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", !!ctx.busy());
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.mode() === "login" ? "Need an account? Register" : "Already registered? Sign in", " ");
        } }, dependencies: [CommonModule,
            ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, RouterLink,
            MatButtonModule, i2.MatButton, MatCardModule, i3.MatCard, i3.MatCardActions, i3.MatCardContent, i3.MatCardHeader, i3.MatCardSubtitle, i3.MatCardTitle, MatDividerModule, i4.MatDivider, MatFormFieldModule, i5.MatFormField, i5.MatLabel, i5.MatError, MatIconModule, i6.MatIcon, MatInputModule, i7.MatInput, MatProgressSpinnerModule, i8.MatProgressSpinner], styles: ["[_nghost-%COMP%] {\n        display: block;\n        min-height: 100vh;\n        color: #102033;\n        background:\n          radial-gradient(circle at top left, rgba(76, 132, 255, 0.18), transparent 30%),\n          radial-gradient(circle at bottom right, rgba(32, 178, 170, 0.14), transparent 28%),\n          linear-gradient(180deg, #f5f8ff 0%, #eef4ff 100%);\n      }\n\n      .page[_ngcontent-%COMP%] {\n        min-height: 100vh;\n        display: grid;\n        grid-template-columns: minmax(280px, 1.1fr) minmax(320px, 0.9fr);\n        gap: 32px;\n        align-items: center;\n        padding: 40px;\n      }\n\n      .hero[_ngcontent-%COMP%] {\n        max-width: 620px;\n      }\n\n      .eyebrow[_ngcontent-%COMP%] {\n        margin: 0 0 12px;\n        letter-spacing: 0.14em;\n        text-transform: uppercase;\n        font-size: 0.78rem;\n        font-weight: 700;\n        color: #3558d6;\n      }\n\n      h1[_ngcontent-%COMP%] {\n        margin: 0;\n        font-size: clamp(2.6rem, 5vw, 4.8rem);\n        line-height: 0.95;\n        letter-spacing: -0.05em;\n      }\n\n      .lede[_ngcontent-%COMP%] {\n        margin: 20px 0 0;\n        max-width: 42rem;\n        font-size: 1.08rem;\n        line-height: 1.7;\n        color: #41506a;\n      }\n\n      .stats[_ngcontent-%COMP%] {\n        display: grid;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n        gap: 16px;\n        margin-top: 28px;\n      }\n\n      .stats[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n        padding: 18px;\n        border-radius: 18px;\n        background: rgba(255, 255, 255, 0.75);\n        border: 1px solid rgba(46, 77, 136, 0.1);\n        backdrop-filter: blur(14px);\n      }\n\n      .stats[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n        display: block;\n        margin-bottom: 4px;\n      }\n\n      .stats[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n        color: #54657f;\n        font-size: 0.95rem;\n      }\n\n      .panel[_ngcontent-%COMP%] {\n        width: min(100%, 480px);\n        margin-left: auto;\n        border-radius: 24px;\n        box-shadow: 0 24px 80px rgba(42, 64, 111, 0.18);\n      }\n\n      mat-card-header[_ngcontent-%COMP%] {\n        padding-bottom: 8px;\n      }\n\n      mat-card-title[_ngcontent-%COMP%] {\n        font-size: 1.5rem;\n      }\n\n      .google[_ngcontent-%COMP%], \n   button[type='submit'][_ngcontent-%COMP%] {\n        width: 100%;\n        min-height: 48px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        gap: 10px;\n      }\n\n      .divider[_ngcontent-%COMP%] {\n        margin: 22px 0;\n      }\n\n      .form[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 14px;\n      }\n\n      .error[_ngcontent-%COMP%] {\n        margin: 0;\n        color: #b42318;\n        font-size: 0.95rem;\n      }\n\n      mat-card-actions[_ngcontent-%COMP%] {\n        padding: 0 16px 16px;\n      }\n\n      @media (max-width: 900px) {\n        .page[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n          padding: 24px;\n        }\n\n        .panel[_ngcontent-%COMP%] {\n          margin-left: 0;\n          width: 100%;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginComponent, [{
        type: Component,
        args: [{ selector: 'app-login', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
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
                ], template: `
    <div class="page">
      <section class="hero">
        <p class="eyebrow">Upkeep</p>
        <h1>Sign in to keep machines moving.</h1>
        <p class="lede">
          Use your email or Google account to access manuals, chat, tickets, and maintenance logs.
        </p>
        <div class="stats">
          <div>
            <strong>Fast access</strong>
            <span>Email and Google sign-in</span>
          </div>
          <div>
            <strong>Org aware</strong>
            <span>Claims drive access after onboarding</span>
          </div>
        </div>
      </section>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>{{ mode() === 'login' ? 'Welcome back' : 'Create your account' }}</mat-card-title>
          <mat-card-subtitle>
            {{ mode() === 'login' ? 'Sign in with email or Google.' : 'Register your account first, then create an org.' }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
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
  `, styles: ["\n      :host {\n        display: block;\n        min-height: 100vh;\n        color: #102033;\n        background:\n          radial-gradient(circle at top left, rgba(76, 132, 255, 0.18), transparent 30%),\n          radial-gradient(circle at bottom right, rgba(32, 178, 170, 0.14), transparent 28%),\n          linear-gradient(180deg, #f5f8ff 0%, #eef4ff 100%);\n      }\n\n      .page {\n        min-height: 100vh;\n        display: grid;\n        grid-template-columns: minmax(280px, 1.1fr) minmax(320px, 0.9fr);\n        gap: 32px;\n        align-items: center;\n        padding: 40px;\n      }\n\n      .hero {\n        max-width: 620px;\n      }\n\n      .eyebrow {\n        margin: 0 0 12px;\n        letter-spacing: 0.14em;\n        text-transform: uppercase;\n        font-size: 0.78rem;\n        font-weight: 700;\n        color: #3558d6;\n      }\n\n      h1 {\n        margin: 0;\n        font-size: clamp(2.6rem, 5vw, 4.8rem);\n        line-height: 0.95;\n        letter-spacing: -0.05em;\n      }\n\n      .lede {\n        margin: 20px 0 0;\n        max-width: 42rem;\n        font-size: 1.08rem;\n        line-height: 1.7;\n        color: #41506a;\n      }\n\n      .stats {\n        display: grid;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n        gap: 16px;\n        margin-top: 28px;\n      }\n\n      .stats div {\n        padding: 18px;\n        border-radius: 18px;\n        background: rgba(255, 255, 255, 0.75);\n        border: 1px solid rgba(46, 77, 136, 0.1);\n        backdrop-filter: blur(14px);\n      }\n\n      .stats strong {\n        display: block;\n        margin-bottom: 4px;\n      }\n\n      .stats span {\n        color: #54657f;\n        font-size: 0.95rem;\n      }\n\n      .panel {\n        width: min(100%, 480px);\n        margin-left: auto;\n        border-radius: 24px;\n        box-shadow: 0 24px 80px rgba(42, 64, 111, 0.18);\n      }\n\n      mat-card-header {\n        padding-bottom: 8px;\n      }\n\n      mat-card-title {\n        font-size: 1.5rem;\n      }\n\n      .google,\n      button[type='submit'] {\n        width: 100%;\n        min-height: 48px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        gap: 10px;\n      }\n\n      .divider {\n        margin: 22px 0;\n      }\n\n      .form {\n        display: grid;\n        gap: 14px;\n      }\n\n      .error {\n        margin: 0;\n        color: #b42318;\n        font-size: 0.95rem;\n      }\n\n      mat-card-actions {\n        padding: 0 16px 16px;\n      }\n\n      @media (max-width: 900px) {\n        .page {\n          grid-template-columns: 1fr;\n          padding: 24px;\n        }\n\n        .panel {\n          margin-left: 0;\n          width: 100%;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login.component.ts", lineNumber: 269 }); })();
