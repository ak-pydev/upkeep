import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function SettingsComponent_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 13);
    i0.ɵɵtext(1, "Loading org info...");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function SettingsComponent_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 16);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_56_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.createOrg()); });
    i0.ɵɵelementStart(1, "label");
    i0.ɵɵtext(2, " Organization name ");
    i0.ɵɵelementStart(3, "input", 17);
    i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Conditional_56_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.orgName, $event) || (ctx_r0.orgName = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "button", 18);
    i0.ɵɵtext(5, " Create organization ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.orgName);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.working());
} }
function SettingsComponent_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "div")(2, "span", 6);
    i0.ɵɵtext(3, "Org status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "strong");
    i0.ɵɵtext(5, "Connected");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div")(7, "span", 6);
    i0.ɵɵtext(8, "Backend org ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div")(12, "span", 6);
    i0.ɵɵtext(13, "Server role");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate(((tmp_1_0 = ctx_r0.profile()) == null ? null : tmp_1_0.orgId) || "pending sync");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(((tmp_2_0 = ctx_r0.profile()) == null ? null : tmp_2_0.role) || "pending sync");
} }
export class SettingsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.working = signal(false, ...(ngDevMode ? [{ debugName: "working" }] : []));
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.profile = signal(null, ...(ngDevMode ? [{ debugName: "profile" }] : []));
        this.orgName = '';
    }
    ngOnInit() {
        this.refresh();
    }
    refresh() {
        this.loading.set(true);
        this.error.set(null);
        this.api
            .me()
            .pipe(catchError(() => {
            this.error.set('Could not load organization settings.');
            return of({ orgId: undefined, role: undefined, needsOrg: true, name: undefined });
        }), finalize(() => this.loading.set(false)))
            .subscribe((result) => {
            this.profile.set(result);
            this.orgName = result.name || this.orgName;
        });
    }
    createOrg() {
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
    static { this.ɵfac = function SettingsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingsComponent, selectors: [["app-settings"]], decls: 58, vars: 7, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "summary"], [1, "stat"], [1, "label"], [1, "layout"], [1, "panel"], [1, "panel-head"], ["type", "button", 1, "button", "secondary", 3, "click"], [1, "info-grid"], [1, "actions"], [1, "empty"], [1, "empty", "error"], [1, "form"], [1, "form", 3, "ngSubmit"], ["name", "orgName", "placeholder", "Acme Machine Shop", "required", "", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "button", 3, "disabled"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Organization");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, "Current auth and org state for the active account.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 4)(10, "article", 5)(11, "span", 6);
            i0.ɵɵtext(12, "Role");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "strong");
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "article", 5)(16, "span", 6);
            i0.ɵɵtext(17, "Org ID");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "strong");
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(20, "div", 7)(21, "section", 8)(22, "div", 9)(23, "h2");
            i0.ɵɵtext(24, "Account");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "button", 10);
            i0.ɵɵlistener("click", function SettingsComponent_Template_button_click_25_listener() { return ctx.refresh(); });
            i0.ɵɵtext(26, "Refresh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "div", 11)(28, "div")(29, "span", 6);
            i0.ɵɵtext(30, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "strong");
            i0.ɵɵtext(32);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "div")(34, "span", 6);
            i0.ɵɵtext(35, "Display name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "strong");
            i0.ɵɵtext(37);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "div")(39, "span", 6);
            i0.ɵɵtext(40, "Needs org");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "strong");
            i0.ɵɵtext(42);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(43, "div", 12)(44, "button", 10);
            i0.ɵɵlistener("click", function SettingsComponent_Template_button_click_44_listener() { return ctx.auth.refreshClaims(); });
            i0.ɵɵtext(45, "Refresh claims");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "button", 10);
            i0.ɵɵlistener("click", function SettingsComponent_Template_button_click_46_listener() { return ctx.auth.logout(); });
            i0.ɵɵtext(47, "Sign out");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(48, "section", 8)(49, "div", 9)(50, "h2");
            i0.ɵɵtext(51, "Organization");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "span");
            i0.ɵɵtext(53);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(54, SettingsComponent_Conditional_54_Template, 2, 0, "p", 13)(55, SettingsComponent_Conditional_55_Template, 2, 1, "p", 14)(56, SettingsComponent_Conditional_56_Template, 6, 2, "form", 15)(57, SettingsComponent_Conditional_57_Template, 16, 2, "div", 11);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_1_0;
            let tmp_2_0;
            let tmp_3_0;
            let tmp_4_0;
            let tmp_5_0;
            let tmp_6_0;
            i0.ɵɵadvance(14);
            i0.ɵɵtextInterpolate(ctx.auth.claims().role || "unassigned");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.auth.claims().orgId || ((tmp_1_0 = ctx.profile()) == null ? null : tmp_1_0.orgId) || "none");
            i0.ɵɵadvance(13);
            i0.ɵɵtextInterpolate(((tmp_2_0 = ctx.auth.user()) == null ? null : tmp_2_0.email) || "unknown");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(((tmp_3_0 = ctx.auth.user()) == null ? null : tmp_3_0.displayName) || "not set");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(((tmp_4_0 = ctx.profile()) == null ? null : tmp_4_0.needsOrg) ? "yes" : "no");
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(((tmp_5_0 = ctx.profile()) == null ? null : tmp_5_0.name) || "current workspace");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading() ? 54 : ctx.error() ? 55 : ((tmp_6_0 = ctx.profile()) == null ? null : tmp_6_0.needsOrg) ? 56 : 57);
        } }, dependencies: [CommonModule, FormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.RequiredValidator, i1.NgModel, i1.NgForm], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%], \n   .stat[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%] {\n        padding: 16px;\n      }\n      .hero[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .summary[_ngcontent-%COMP%], \n   .layout[_ngcontent-%COMP%], \n   .info-grid[_ngcontent-%COMP%], \n   .actions[_ngcontent-%COMP%], \n   .form[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n      .layout[_ngcontent-%COMP%] {\n        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      }\n      .summary[_ngcontent-%COMP%] {\n        min-width: 240px;\n      }\n      .stat[_ngcontent-%COMP%] {\n        padding: 14px;\n      }\n      .panel-head[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n      .label[_ngcontent-%COMP%], \n   .eyebrow[_ngcontent-%COMP%], \n   .lede[_ngcontent-%COMP%], \n   .empty[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .info-grid[_ngcontent-%COMP%] {\n        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n      }\n      .actions[_ngcontent-%COMP%] {\n        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n        margin-top: 16px;\n      }\n      label[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n      }\n      input[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary[_ngcontent-%COMP%] {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .empty.error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n      @media (max-width: 760px) {\n        .hero[_ngcontent-%COMP%], \n   .layout[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n        .summary[_ngcontent-%COMP%] {\n          min-width: 0;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsComponent, [{
        type: Component,
        args: [{ selector: 'app-settings', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
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
            <button type="button" class="button secondary" (click)="auth.logout()">Sign out</button>
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
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 16px;\n      }\n      .hero,\n      .panel,\n      .stat {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero,\n      .panel {\n        padding: 16px;\n      }\n      .hero {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .summary,\n      .layout,\n      .info-grid,\n      .actions,\n      .form {\n        display: grid;\n        gap: 12px;\n      }\n      .layout {\n        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      }\n      .summary {\n        min-width: 240px;\n      }\n      .stat {\n        padding: 14px;\n      }\n      .panel-head {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n      .label,\n      .eyebrow,\n      .lede,\n      .empty {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .info-grid {\n        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n      }\n      .actions {\n        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n        margin-top: 16px;\n      }\n      label {\n        display: grid;\n        gap: 6px;\n      }\n      input {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .empty.error {\n        color: #b91c1c;\n      }\n      @media (max-width: 760px) {\n        .hero,\n        .layout {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n        .summary {\n          min-width: 0;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/features/settings/settings.component.ts", lineNumber: 199 }); })();
