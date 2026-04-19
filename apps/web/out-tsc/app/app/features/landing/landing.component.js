import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/button";
function LandingComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 4);
    i0.ɵɵtext(1, "Open workspace");
    i0.ɵɵelementEnd();
} }
function LandingComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 5);
    i0.ɵɵtext(1, "Sign in");
    i0.ɵɵelementEnd();
} }
export class LandingComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.isAuthenticated = computed(() => this.auth.isAuthenticated(), ...(ngDevMode ? [{ debugName: "isAuthenticated" }] : []));
    }
    static { this.ɵfac = function LandingComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LandingComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LandingComponent, selectors: [["app-landing"]], decls: 30, vars: 1, consts: [[1, "hero"], [1, "copy"], [1, "eyebrow"], [1, "actions"], ["mat-flat-button", "", "color", "primary", "routerLink", "/app/dashboard"], ["mat-flat-button", "", "color", "primary", "routerLink", "/login"], ["mat-stroked-button", "", "routerLink", "/app/chat"], [1, "panel", "upkeep-card"], [1, "panel-head"], [1, "upkeep-pill", "ok"], [1, "upkeep-muted"]], template: function LandingComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "span", 2);
            i0.ɵɵtext(3, "Industrial AI support");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Find the fix, cite the manual, log the repair.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p");
            i0.ɵɵtext(7, " Upkeep helps machine shops upload manuals, ask grounded questions, surface likely parts, and keep a searchable maintenance history for the next downtime event. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 3);
            i0.ɵɵconditionalCreate(9, LandingComponent_Conditional_9_Template, 2, 0, "a", 4)(10, LandingComponent_Conditional_10_Template, 2, 0, "a", 5);
            i0.ɵɵelementStart(11, "a", 6);
            i0.ɵɵtext(12, "View demo flow");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "div", 7)(14, "div", 8)(15, "span", 9);
            i0.ɵɵtext(16, "Grounded answer");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span", 10);
            i0.ɵɵtext(18, "Haas VF-2 \u00B7 E32");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "h2");
            i0.ɵɵtext(20, "Spindle encoder signal fault");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p", 10);
            i0.ɵɵtext(22, " Check the encoder cable, confirm connector seating, then inspect the spindle encoder assembly. Replacement parts are linked below and the fix can be logged directly into maintenance history. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "ul")(24, "li");
            i0.ɵɵtext(25, "Cited from OEM manual pages with extracted snippets");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "li");
            i0.ɵɵtext(27, "Parts links generated for McMaster-Carr and Grainger");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "li");
            i0.ɵɵtext(29, "Repair history retained per machine and org");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.isAuthenticated() ? 9 : 10);
        } }, dependencies: [CommonModule, RouterLink, MatButtonModule, i1.MatButton, MatIconModule], styles: ["[_nghost-%COMP%] {\n        display: block;\n        min-height: 100vh;\n        background:\n          radial-gradient(circle at top left, rgba(30, 136, 229, 0.16), transparent 32%),\n          linear-gradient(180deg, #f7fbff 0%, #eef3f8 100%);\n      }\n      .hero[_ngcontent-%COMP%] {\n        max-width: 1180px;\n        margin: 0 auto;\n        padding: 64px 24px;\n        display: grid;\n        gap: 32px;\n      }\n      .copy[_ngcontent-%COMP%] {\n        max-width: 720px;\n      }\n      .eyebrow[_ngcontent-%COMP%] {\n        display: inline-block;\n        margin-bottom: 16px;\n        font-size: 12px;\n        letter-spacing: 0.08em;\n        text-transform: uppercase;\n        color: var(--upkeep-primary-dark);\n        font-weight: 700;\n      }\n      h1[_ngcontent-%COMP%] {\n        margin: 0 0 16px;\n        font-size: clamp(36px, 6vw, 64px);\n        line-height: 0.95;\n        letter-spacing: -0.04em;\n      }\n      p[_ngcontent-%COMP%] {\n        margin: 0;\n        max-width: 64ch;\n        font-size: 18px;\n        line-height: 1.6;\n      }\n      .actions[_ngcontent-%COMP%] {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 12px;\n        margin-top: 24px;\n      }\n      .panel[_ngcontent-%COMP%] {\n        max-width: 720px;\n      }\n      .panel-head[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 16px;\n      }\n      h2[_ngcontent-%COMP%] {\n        margin: 0 0 12px;\n        font-size: 24px;\n      }\n      ul[_ngcontent-%COMP%] {\n        margin: 16px 0 0;\n        padding-left: 18px;\n      }\n      li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n        margin-top: 10px;\n      }\n      @media (min-width: 900px) {\n        .hero[_ngcontent-%COMP%] {\n          grid-template-columns: minmax(0, 1.3fr) minmax(340px, 0.9fr);\n          align-items: center;\n          min-height: 100vh;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LandingComponent, [{
        type: Component,
        args: [{ selector: 'app-landing', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule], template: `
    <section class="hero">
      <div class="copy">
        <span class="eyebrow">Industrial AI support</span>
        <h1>Find the fix, cite the manual, log the repair.</h1>
        <p>
          Upkeep helps machine shops upload manuals, ask grounded questions, surface
          likely parts, and keep a searchable maintenance history for the next downtime event.
        </p>
        <div class="actions">
          @if (isAuthenticated()) {
            <a mat-flat-button color="primary" routerLink="/app/dashboard">Open workspace</a>
          } @else {
            <a mat-flat-button color="primary" routerLink="/login">Sign in</a>
          }
          <a mat-stroked-button routerLink="/app/chat">View demo flow</a>
        </div>
      </div>

      <div class="panel upkeep-card">
        <div class="panel-head">
          <span class="upkeep-pill ok">Grounded answer</span>
          <span class="upkeep-muted">Haas VF-2 · E32</span>
        </div>
        <h2>Spindle encoder signal fault</h2>
        <p class="upkeep-muted">
          Check the encoder cable, confirm connector seating, then inspect the spindle encoder assembly.
          Replacement parts are linked below and the fix can be logged directly into maintenance history.
        </p>
        <ul>
          <li>Cited from OEM manual pages with extracted snippets</li>
          <li>Parts links generated for McMaster-Carr and Grainger</li>
          <li>Repair history retained per machine and org</li>
        </ul>
      </div>
    </section>
  `, styles: ["\n      :host {\n        display: block;\n        min-height: 100vh;\n        background:\n          radial-gradient(circle at top left, rgba(30, 136, 229, 0.16), transparent 32%),\n          linear-gradient(180deg, #f7fbff 0%, #eef3f8 100%);\n      }\n      .hero {\n        max-width: 1180px;\n        margin: 0 auto;\n        padding: 64px 24px;\n        display: grid;\n        gap: 32px;\n      }\n      .copy {\n        max-width: 720px;\n      }\n      .eyebrow {\n        display: inline-block;\n        margin-bottom: 16px;\n        font-size: 12px;\n        letter-spacing: 0.08em;\n        text-transform: uppercase;\n        color: var(--upkeep-primary-dark);\n        font-weight: 700;\n      }\n      h1 {\n        margin: 0 0 16px;\n        font-size: clamp(36px, 6vw, 64px);\n        line-height: 0.95;\n        letter-spacing: -0.04em;\n      }\n      p {\n        margin: 0;\n        max-width: 64ch;\n        font-size: 18px;\n        line-height: 1.6;\n      }\n      .actions {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 12px;\n        margin-top: 24px;\n      }\n      .panel {\n        max-width: 720px;\n      }\n      .panel-head {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 16px;\n      }\n      h2 {\n        margin: 0 0 12px;\n        font-size: 24px;\n      }\n      ul {\n        margin: 16px 0 0;\n        padding-left: 18px;\n      }\n      li + li {\n        margin-top: 10px;\n      }\n      @media (min-width: 900px) {\n        .hero {\n          grid-template-columns: minmax(0, 1.3fr) minmax(340px, 0.9fr);\n          align-items: center;\n          min-height: 100vh;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LandingComponent, { className: "LandingComponent", filePath: "src/app/features/landing/landing.component.ts", lineNumber: 126 }); })();
