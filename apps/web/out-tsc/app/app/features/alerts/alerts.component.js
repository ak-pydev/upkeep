import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function AlertsComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 7);
    i0.ɵɵtext(1, "Loading alerts...");
    i0.ɵɵdomElementEnd();
} }
function AlertsComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 8);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function AlertsComponent_Conditional_22_For_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "article", 12)(1, "div", 14)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 15)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(15, "div", 16)(16, "button", 17);
    i0.ɵɵdomListener("click", function AlertsComponent_Conditional_22_For_8_Template_button_click_16_listener() { const alert_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.ack(alert_r4)); });
    i0.ɵɵtext(17, " Acknowledge ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(18, "button", 18);
    i0.ɵɵdomListener("click", function AlertsComponent_Conditional_22_For_8_Template_button_click_18_listener() { const alert_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.dismiss(alert_r4)); });
    i0.ɵɵtext(19, " Dismiss ");
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const alert_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(alert_r4.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r4.detail);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(alert_r4.kind);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r4.status);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r4.machineName || alert_r4.machineId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r4.dueAt || "no due date");
    i0.ɵɵadvance(2);
    i0.ɵɵdomProperty("disabled", ctx_r0.workingId() === alert_r4.id);
    i0.ɵɵadvance(2);
    i0.ɵɵdomProperty("disabled", ctx_r0.workingId() === alert_r4.id);
} }
function AlertsComponent_Conditional_22_ForEmpty_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 13);
    i0.ɵɵtext(1, "No active alerts.");
    i0.ɵɵdomElementEnd();
} }
function AlertsComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "section", 7)(1, "div", 9)(2, "h2");
    i0.ɵɵtext(3, "Current alerts");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "button", 10);
    i0.ɵɵdomListener("click", function AlertsComponent_Conditional_22_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.load()); });
    i0.ɵɵtext(5, "Refresh");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 11);
    i0.ɵɵrepeaterCreate(7, AlertsComponent_Conditional_22_For_8_Template, 20, 8, "article", 12, _forTrack0, false, AlertsComponent_Conditional_22_ForEmpty_9_Template, 2, 0, "p", 13);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵrepeater(ctx_r0.alerts());
} }
export class AlertsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.workingId = signal(null, ...(ngDevMode ? [{ debugName: "workingId" }] : []));
        this.alerts = signal([], ...(ngDevMode ? [{ debugName: "alerts" }] : []));
        this.dueSoonCount = signal(0, ...(ngDevMode ? [{ debugName: "dueSoonCount" }] : []));
    }
    ngOnInit() {
        this.load();
    }
    load() {
        this.loading.set(true);
        this.error.set(null);
        this.api
            .listAlerts()
            .pipe(catchError(() => {
            this.error.set('Could not load alerts.');
            return of({ alerts: [] });
        }), finalize(() => this.loading.set(false)))
            .subscribe((result) => {
            this.alerts.set(result.alerts);
            const now = Date.now();
            const dueSoon = result.alerts.filter((alert) => {
                if (!alert.dueAt)
                    return false;
                const due = new Date(alert.dueAt).getTime();
                return due >= now && due - now <= 3 * 24 * 60 * 60 * 1000;
            });
            this.dueSoonCount.set(dueSoon.length);
        });
    }
    ack(alert) {
        this.workingId.set(alert.id);
        this.api
            .ackAlert(alert.id)
            .pipe(finalize(() => this.workingId.set(null)))
            .subscribe({
            next: () => this.load(),
            error: () => this.error.set(`Could not acknowledge ${alert.title}.`),
        });
    }
    dismiss(alert) {
        this.workingId.set(alert.id);
        this.api
            .dismissAlert(alert.id)
            .pipe(finalize(() => this.workingId.set(null)))
            .subscribe({
            next: () => this.load(),
            error: () => this.error.set(`Could not dismiss ${alert.title}.`),
        });
    }
    static { this.ɵfac = function AlertsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AlertsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AlertsComponent, selectors: [["app-alerts"]], decls: 23, vars: 3, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "summary"], [1, "stat"], [1, "label"], [1, "panel"], [1, "panel", "error"], [1, "panel-head"], ["type", "button", 1, "button", "secondary", 3, "click"], [1, "list"], [1, "alert-card"], [1, "empty"], [1, "alert-main"], [1, "meta"], [1, "actions"], ["type", "button", 1, "button", "secondary", 3, "click", "disabled"], ["type", "button", 1, "button", 3, "click", "disabled"]], template: function AlertsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Predictive alerts");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "h1");
            i0.ɵɵtext(6, "Alerts");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(7, "p", 3);
            i0.ɵɵtext(8, "Review due services and acknowledge or dismiss alerts from the list.");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(9, "div", 4)(10, "article", 5)(11, "span", 6);
            i0.ɵɵtext(12, "Total");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(13, "strong");
            i0.ɵɵtext(14);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(15, "article", 5)(16, "span", 6);
            i0.ɵɵtext(17, "Due soon");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(18, "strong");
            i0.ɵɵtext(19);
            i0.ɵɵdomElementEnd()()()();
            i0.ɵɵconditionalCreate(20, AlertsComponent_Conditional_20_Template, 2, 0, "div", 7)(21, AlertsComponent_Conditional_21_Template, 2, 1, "div", 8)(22, AlertsComponent_Conditional_22_Template, 10, 1, "section", 7);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(14);
            i0.ɵɵtextInterpolate(ctx.alerts().length);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.dueSoonCount());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading() ? 20 : ctx.error() ? 21 : 22);
        } }, dependencies: [CommonModule], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%], \n   .stat[_ngcontent-%COMP%], \n   .alert-card[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%] {\n        padding: 16px;\n      }\n      .hero[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .summary[_ngcontent-%COMP%], \n   .list[_ngcontent-%COMP%], \n   .alert-card[_ngcontent-%COMP%], \n   .actions[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n      .summary[_ngcontent-%COMP%] {\n        min-width: 240px;\n      }\n      .stat[_ngcontent-%COMP%] {\n        padding: 14px;\n      }\n      .label[_ngcontent-%COMP%], \n   .eyebrow[_ngcontent-%COMP%], \n   .lede[_ngcontent-%COMP%], \n   .meta[_ngcontent-%COMP%], \n   .empty[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head[_ngcontent-%COMP%], \n   .actions[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .alert-card[_ngcontent-%COMP%] {\n        padding: 14px;\n      }\n      .meta[_ngcontent-%COMP%] {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      .button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary[_ngcontent-%COMP%] {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n      @media (max-width: 760px) {\n        .hero[_ngcontent-%COMP%] {\n          flex-direction: column;\n        }\n        .summary[_ngcontent-%COMP%] {\n          min-width: 0;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AlertsComponent, [{
        type: Component,
        args: [{ selector: 'app-alerts', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Predictive alerts</p>
          <h1>Alerts</h1>
          <p class="lede">Review due services and acknowledge or dismiss alerts from the list.</p>
        </div>
        <div class="summary">
          <article class="stat">
            <span class="label">Total</span>
            <strong>{{ alerts().length }}</strong>
          </article>
          <article class="stat">
            <span class="label">Due soon</span>
            <strong>{{ dueSoonCount() }}</strong>
          </article>
        </div>
      </header>

      @if (loading()) {
        <div class="panel">Loading alerts...</div>
      } @else if (error()) {
        <div class="panel error">{{ error() }}</div>
      } @else {
        <section class="panel">
          <div class="panel-head">
            <h2>Current alerts</h2>
            <button type="button" class="button secondary" (click)="load()">Refresh</button>
          </div>

          <div class="list">
            @for (alert of alerts(); track alert.id) {
              <article class="alert-card">
                <div class="alert-main">
                  <strong>{{ alert.title }}</strong>
                  <p>{{ alert.detail }}</p>
                </div>
                <div class="meta">
                  <span>{{ alert.kind }}</span>
                  <span>{{ alert.status }}</span>
                  <span>{{ alert.machineName || alert.machineId }}</span>
                  <span>{{ alert.dueAt || 'no due date' }}</span>
                </div>
                <div class="actions">
                  <button
                    type="button"
                    class="button secondary"
                    (click)="ack(alert)"
                    [disabled]="workingId() === alert.id"
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    class="button"
                    (click)="dismiss(alert)"
                    [disabled]="workingId() === alert.id"
                  >
                    Dismiss
                  </button>
                </div>
              </article>
            } @empty {
              <p class="empty">No active alerts.</p>
            }
          </div>
        </section>
      }
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 16px;\n      }\n      .hero,\n      .panel,\n      .stat,\n      .alert-card {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero,\n      .panel {\n        padding: 16px;\n      }\n      .hero {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .summary,\n      .list,\n      .alert-card,\n      .actions {\n        display: grid;\n        gap: 12px;\n      }\n      .summary {\n        min-width: 240px;\n      }\n      .stat {\n        padding: 14px;\n      }\n      .label,\n      .eyebrow,\n      .lede,\n      .meta,\n      .empty {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head,\n      .actions {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .alert-card {\n        padding: 14px;\n      }\n      .meta {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      .button {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .error {\n        color: #b91c1c;\n      }\n      @media (max-width: 760px) {\n        .hero {\n          flex-direction: column;\n        }\n        .summary {\n          min-width: 0;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AlertsComponent, { className: "AlertsComponent", filePath: "src/app/features/alerts/alerts.component.ts", lineNumber: 166 }); })();
