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
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/divider";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/progress-spinner";
function OnboardingComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Organization name is required.");
    i0.ɵɵelementEnd();
} }
function OnboardingComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function OnboardingComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-progress-spinner", 11);
} }
function OnboardingComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1, "domain_add");
    i0.ɵɵelementEnd();
} }
export class OnboardingComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.api = inject(ApiService);
        this.router = inject(Router);
        this.fb = inject(FormBuilder);
        this.busy = signal(false, ...(ngDevMode ? [{ debugName: "busy" }] : []));
        this.error = signal('', ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.form = this.fb.nonNullable.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
        });
    }
    get name() {
        return this.form.controls.name;
    }
    async submit() {
        if (this.form.invalid || this.busy())
            return;
        this.busy.set(true);
        this.error.set('');
        try {
            const { name } = this.form.getRawValue();
            await firstValueFrom(this.api.createOrg(name));
            await this.auth.refreshClaims();
            await this.router.navigateByUrl('/app/dashboard');
        }
        catch (err) {
            this.error.set(this.messageFromError(err, 'Unable to create the organization.'));
        }
        finally {
            this.busy.set(false);
        }
    }
    async refreshClaims() {
        if (this.busy())
            return;
        this.busy.set(true);
        this.error.set('');
        try {
            await this.auth.refreshClaims();
            await this.router.navigateByUrl('/app/dashboard');
        }
        catch (err) {
            this.error.set(this.messageFromError(err, 'Unable to refresh claims.'));
        }
        finally {
            this.busy.set(false);
        }
    }
    messageFromError(err, fallback) {
        if (err instanceof Error && err.message)
            return err.message;
        return fallback;
    }
    static { this.ɵfac = function OnboardingComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OnboardingComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OnboardingComponent, selectors: [["app-onboarding"]], decls: 51, vars: 7, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "callouts"], [1, "panel"], [1, "form", 3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "name", "placeholder", "Acme Manufacturing", "autocomplete", "organization"], [1, "error"], ["mat-flat-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["diameter", "18", "mode", "indeterminate"], [1, "divider"], [1, "hint"], ["align", "end"], ["mat-button", "", "type", "button", 3, "click", "disabled"], ["mat-button", "", "routerLink", "/login"]], template: function OnboardingComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "p", 2);
            i0.ɵɵtext(3, "Onboarding");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Set up your organization.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 3);
            i0.ɵɵtext(7, " Create the org record that scopes machines, manuals, alerts, tickets, and claims. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 4)(9, "div")(10, "mat-icon");
            i0.ɵɵtext(11, "domain");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "div")(13, "strong");
            i0.ɵɵtext(14, "Org first");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "span");
            i0.ɵɵtext(16, "Required before the app shell opens");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "div")(18, "mat-icon");
            i0.ɵɵtext(19, "verified_user");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "div")(21, "strong");
            i0.ɵɵtext(22, "Claims refresh");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "span");
            i0.ɵɵtext(24, "We refresh your Firebase token after creation");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(25, "mat-card", 5)(26, "mat-card-header")(27, "mat-card-title");
            i0.ɵɵtext(28, "Create your organization");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "mat-card-subtitle");
            i0.ɵɵtext(30);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "mat-card-content")(32, "form", 6);
            i0.ɵɵlistener("ngSubmit", function OnboardingComponent_Template_form_ngSubmit_32_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(33, "mat-form-field", 7)(34, "mat-label");
            i0.ɵɵtext(35, "Organization name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(36, "input", 8);
            i0.ɵɵconditionalCreate(37, OnboardingComponent_Conditional_37_Template, 2, 0, "mat-error");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(38, OnboardingComponent_Conditional_38_Template, 2, 1, "p", 9);
            i0.ɵɵelementStart(39, "button", 10);
            i0.ɵɵconditionalCreate(40, OnboardingComponent_Conditional_40_Template, 1, 0, "mat-progress-spinner", 11)(41, OnboardingComponent_Conditional_41_Template, 2, 0, "mat-icon");
            i0.ɵɵtext(42, " Create org ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(43, "mat-divider", 12);
            i0.ɵɵelementStart(44, "p", 13);
            i0.ɵɵtext(45, " Already have an organization? If your claims are stale, use the refresh action after the backend has assigned them. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(46, "mat-card-actions", 14)(47, "button", 15);
            i0.ɵɵlistener("click", function OnboardingComponent_Template_button_click_47_listener() { return ctx.refreshClaims(); });
            i0.ɵɵtext(48, " Refresh claims ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "a", 16);
            i0.ɵɵtext(50, "Back to login");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance(30);
            i0.ɵɵtextInterpolate1(" ", ((tmp_0_0 = ctx.auth.user()) == null ? null : tmp_0_0.email) || "Signed-in user", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.name.invalid && ctx.name.touched ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error() ? 38 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.form.invalid || !!ctx.busy());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.busy() ? 40 : 41);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("disabled", !!ctx.busy());
        } }, dependencies: [CommonModule,
            ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, RouterLink,
            MatButtonModule, i2.MatButton, MatCardModule, i3.MatCard, i3.MatCardActions, i3.MatCardContent, i3.MatCardHeader, i3.MatCardSubtitle, i3.MatCardTitle, MatDividerModule, i4.MatDivider, MatFormFieldModule, i5.MatFormField, i5.MatLabel, i5.MatError, MatIconModule, i6.MatIcon, MatInputModule, i7.MatInput, MatProgressSpinnerModule, i8.MatProgressSpinner], styles: ["[_nghost-%COMP%] {\n        display: block;\n        min-height: 100vh;\n        color: #102033;\n        background:\n          radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 28%),\n          radial-gradient(circle at bottom left, rgba(60, 130, 255, 0.12), transparent 30%),\n          linear-gradient(180deg, #fffaf2 0%, #f5f8ff 100%);\n      }\n\n      .page[_ngcontent-%COMP%] {\n        min-height: 100vh;\n        display: grid;\n        grid-template-columns: minmax(280px, 1.05fr) minmax(320px, 0.95fr);\n        gap: 32px;\n        align-items: center;\n        padding: 40px;\n      }\n\n      .hero[_ngcontent-%COMP%] {\n        max-width: 640px;\n      }\n\n      .eyebrow[_ngcontent-%COMP%] {\n        margin: 0 0 12px;\n        letter-spacing: 0.14em;\n        text-transform: uppercase;\n        font-size: 0.78rem;\n        font-weight: 700;\n        color: #9a5b00;\n      }\n\n      h1[_ngcontent-%COMP%] {\n        margin: 0;\n        font-size: clamp(2.4rem, 5vw, 4.4rem);\n        line-height: 0.95;\n        letter-spacing: -0.05em;\n      }\n\n      .lede[_ngcontent-%COMP%] {\n        margin: 20px 0 0;\n        max-width: 42rem;\n        font-size: 1.08rem;\n        line-height: 1.7;\n        color: #41506a;\n      }\n\n      .callouts[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n        margin-top: 28px;\n      }\n\n      .callouts[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n        display: flex;\n        gap: 14px;\n        align-items: flex-start;\n        padding: 18px;\n        border-radius: 18px;\n        background: rgba(255, 255, 255, 0.78);\n        border: 1px solid rgba(46, 77, 136, 0.1);\n        backdrop-filter: blur(14px);\n      }\n\n      .callouts[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n        color: #3558d6;\n      }\n\n      .callouts[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n        display: block;\n        margin-bottom: 4px;\n      }\n\n      .callouts[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n   .hint[_ngcontent-%COMP%] {\n        color: #54657f;\n        font-size: 0.95rem;\n        line-height: 1.6;\n      }\n\n      .panel[_ngcontent-%COMP%] {\n        width: min(100%, 480px);\n        margin-left: auto;\n        border-radius: 24px;\n        box-shadow: 0 24px 80px rgba(42, 64, 111, 0.18);\n      }\n\n      mat-card-header[_ngcontent-%COMP%] {\n        padding-bottom: 8px;\n      }\n\n      mat-card-title[_ngcontent-%COMP%] {\n        font-size: 1.5rem;\n      }\n\n      .form[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 14px;\n      }\n\n      button[type='submit'][_ngcontent-%COMP%] {\n        width: 100%;\n        min-height: 48px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        gap: 10px;\n      }\n\n      .divider[_ngcontent-%COMP%] {\n        margin: 22px 0 16px;\n      }\n\n      .error[_ngcontent-%COMP%] {\n        margin: 0;\n        color: #b42318;\n        font-size: 0.95rem;\n      }\n\n      .hint[_ngcontent-%COMP%] {\n        margin: 0;\n      }\n\n      mat-card-actions[_ngcontent-%COMP%] {\n        padding: 0 16px 16px;\n      }\n\n      @media (max-width: 900px) {\n        .page[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n          padding: 24px;\n        }\n\n        .panel[_ngcontent-%COMP%] {\n          margin-left: 0;\n          width: 100%;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OnboardingComponent, [{
        type: Component,
        args: [{ selector: 'app-onboarding', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
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
        <p class="eyebrow">Onboarding</p>
        <h1>Set up your organization.</h1>
        <p class="lede">
          Create the org record that scopes machines, manuals, alerts, tickets, and claims.
        </p>
        <div class="callouts">
          <div>
            <mat-icon>domain</mat-icon>
            <div>
              <strong>Org first</strong>
              <span>Required before the app shell opens</span>
            </div>
          </div>
          <div>
            <mat-icon>verified_user</mat-icon>
            <div>
              <strong>Claims refresh</strong>
              <span>We refresh your Firebase token after creation</span>
            </div>
          </div>
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
  `, styles: ["\n      :host {\n        display: block;\n        min-height: 100vh;\n        color: #102033;\n        background:\n          radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 28%),\n          radial-gradient(circle at bottom left, rgba(60, 130, 255, 0.12), transparent 30%),\n          linear-gradient(180deg, #fffaf2 0%, #f5f8ff 100%);\n      }\n\n      .page {\n        min-height: 100vh;\n        display: grid;\n        grid-template-columns: minmax(280px, 1.05fr) minmax(320px, 0.95fr);\n        gap: 32px;\n        align-items: center;\n        padding: 40px;\n      }\n\n      .hero {\n        max-width: 640px;\n      }\n\n      .eyebrow {\n        margin: 0 0 12px;\n        letter-spacing: 0.14em;\n        text-transform: uppercase;\n        font-size: 0.78rem;\n        font-weight: 700;\n        color: #9a5b00;\n      }\n\n      h1 {\n        margin: 0;\n        font-size: clamp(2.4rem, 5vw, 4.4rem);\n        line-height: 0.95;\n        letter-spacing: -0.05em;\n      }\n\n      .lede {\n        margin: 20px 0 0;\n        max-width: 42rem;\n        font-size: 1.08rem;\n        line-height: 1.7;\n        color: #41506a;\n      }\n\n      .callouts {\n        display: grid;\n        gap: 16px;\n        margin-top: 28px;\n      }\n\n      .callouts div {\n        display: flex;\n        gap: 14px;\n        align-items: flex-start;\n        padding: 18px;\n        border-radius: 18px;\n        background: rgba(255, 255, 255, 0.78);\n        border: 1px solid rgba(46, 77, 136, 0.1);\n        backdrop-filter: blur(14px);\n      }\n\n      .callouts mat-icon {\n        color: #3558d6;\n      }\n\n      .callouts strong {\n        display: block;\n        margin-bottom: 4px;\n      }\n\n      .callouts span,\n      .hint {\n        color: #54657f;\n        font-size: 0.95rem;\n        line-height: 1.6;\n      }\n\n      .panel {\n        width: min(100%, 480px);\n        margin-left: auto;\n        border-radius: 24px;\n        box-shadow: 0 24px 80px rgba(42, 64, 111, 0.18);\n      }\n\n      mat-card-header {\n        padding-bottom: 8px;\n      }\n\n      mat-card-title {\n        font-size: 1.5rem;\n      }\n\n      .form {\n        display: grid;\n        gap: 14px;\n      }\n\n      button[type='submit'] {\n        width: 100%;\n        min-height: 48px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        gap: 10px;\n      }\n\n      .divider {\n        margin: 22px 0 16px;\n      }\n\n      .error {\n        margin: 0;\n        color: #b42318;\n        font-size: 0.95rem;\n      }\n\n      .hint {\n        margin: 0;\n      }\n\n      mat-card-actions {\n        padding: 0 16px 16px;\n      }\n\n      @media (max-width: 900px) {\n        .page {\n          grid-template-columns: 1fr;\n          padding: 24px;\n        }\n\n        .panel {\n          margin-left: 0;\n          width: 100%;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OnboardingComponent, { className: "OnboardingComponent", filePath: "src/app/features/auth/onboarding.component.ts", lineNumber: 255 }); })();
