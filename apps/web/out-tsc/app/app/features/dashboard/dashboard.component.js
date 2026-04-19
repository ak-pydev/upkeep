import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin, of, finalize, catchError } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService, } from '../../core/services/api.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function DashboardComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 7);
    i0.ɵɵtext(1, "Loading dashboard data...");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "div", 8)(1, "strong");
    i0.ɵɵtext(2, "Could not load data.");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "button", 9);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_21_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.load()); });
    i0.ɵɵtext(6, "Retry");
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function DashboardComponent_Conditional_22_For_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 15)(1, "div", 17)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 18)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const ticket_r3 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ticket_r3.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r3.description);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ticket_r3.status);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r3.priority);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r3.machineId);
} }
function DashboardComponent_Conditional_22_ForEmpty_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 16);
    i0.ɵɵtext(1, "No tickets yet.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_22_For_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 15)(1, "div", 17)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 18)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const alert_r4 = ctx.$implicit;
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
} }
function DashboardComponent_Conditional_22_ForEmpty_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 16);
    i0.ɵɵtext(1, "No alerts queued.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_22_For_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 15)(1, "div", 17)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 18)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r5.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r5.resolution);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r5.machineId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r5.technicianUid);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r5.occurredAt || "recent");
} }
function DashboardComponent_Conditional_22_ForEmpty_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 16);
    i0.ɵɵtext(1, "No maintenance log entries yet.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 10)(1, "article", 11)(2, "span", 6);
    i0.ɵɵtext(3, "Machines");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "article", 11)(7, "span", 6);
    i0.ɵɵtext(8, "Manuals indexed");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(11, "article", 11)(12, "span", 6);
    i0.ɵɵtext(13, "Open tickets");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(16, "article", 11)(17, "span", 6);
    i0.ɵɵtext(18, "Active alerts");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(19, "strong");
    i0.ɵɵtext(20);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(21, "article", 11)(22, "span", 6);
    i0.ɵɵtext(23, "Fix logs");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(24, "strong");
    i0.ɵɵtext(25);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(26, "article", 11)(27, "span", 6);
    i0.ɵɵtext(28, "Chat threads");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(29, "strong");
    i0.ɵɵtext(30);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(31, "div", 12)(32, "section", 7)(33, "div", 13)(34, "h2");
    i0.ɵɵtext(35, "Tickets");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(36, "span");
    i0.ɵɵtext(37);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(38, "div", 14);
    i0.ɵɵrepeaterCreate(39, DashboardComponent_Conditional_22_For_40_Template, 13, 5, "article", 15, _forTrack0, false, DashboardComponent_Conditional_22_ForEmpty_41_Template, 2, 0, "p", 16);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(42, "section", 7)(43, "div", 13)(44, "h2");
    i0.ɵɵtext(45, "Alerts");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(46, "span");
    i0.ɵɵtext(47);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(48, "div", 14);
    i0.ɵɵrepeaterCreate(49, DashboardComponent_Conditional_22_For_50_Template, 13, 5, "article", 15, _forTrack0, false, DashboardComponent_Conditional_22_ForEmpty_51_Template, 2, 0, "p", 16);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(52, "section", 7)(53, "div", 13)(54, "h2");
    i0.ɵɵtext(55, "Recent fixes");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(56, "span");
    i0.ɵɵtext(57);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(58, "div", 14);
    i0.ɵɵrepeaterCreate(59, DashboardComponent_Conditional_22_For_60_Template, 13, 5, "article", 15, _forTrack0, false, DashboardComponent_Conditional_22_ForEmpty_61_Template, 2, 0, "p", 16);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().machines);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().indexedManuals);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().openTickets);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().activeAlerts);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().historyEntries);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.summary().threads);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1("", ctx_r1.tickets().length, " total");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.tickets().slice(0, 5));
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", ctx_r1.alerts().length, " total");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.alerts().slice(0, 5));
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", ctx_r1.history().length, " logged");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.history().slice(0, 5));
} }
export class DashboardComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.api = inject(ApiService);
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.state = signal({
            machines: [],
            manuals: [],
            tickets: [],
            alerts: [],
            history: [],
            threads: [],
        }, ...(ngDevMode ? [{ debugName: "state" }] : []));
        this.machines = computed(() => this.state().machines, ...(ngDevMode ? [{ debugName: "machines" }] : []));
        this.manuals = computed(() => this.state().manuals, ...(ngDevMode ? [{ debugName: "manuals" }] : []));
        this.tickets = computed(() => this.state().tickets, ...(ngDevMode ? [{ debugName: "tickets" }] : []));
        this.alerts = computed(() => this.state().alerts, ...(ngDevMode ? [{ debugName: "alerts" }] : []));
        this.history = computed(() => this.state().history, ...(ngDevMode ? [{ debugName: "history" }] : []));
        this.threads = computed(() => this.state().threads, ...(ngDevMode ? [{ debugName: "threads" }] : []));
        this.summary = computed(() => {
            const state = this.state();
            return {
                machines: state.machines.length,
                indexedManuals: state.manuals.filter((manual) => manual.status === 'indexed').length,
                openTickets: state.tickets.filter((ticket) => ticket.status !== 'closed').length,
                activeAlerts: state.alerts.filter((alert) => !['dismissed', 'acked'].includes(alert.status)).length,
                historyEntries: state.history.length,
                threads: state.threads.length,
            };
        }, ...(ngDevMode ? [{ debugName: "summary" }] : []));
    }
    ngOnInit() {
        this.load();
    }
    load() {
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            machines: this.api.listMachines().pipe(catchError(() => of({ machines: [] }))),
            manuals: this.api.listManuals().pipe(catchError(() => of({ manuals: [] }))),
            tickets: this.api.listTickets().pipe(catchError(() => of({ tickets: [] }))),
            alerts: this.api.listAlerts().pipe(catchError(() => of({ alerts: [] }))),
            history: this.api.listLog().pipe(catchError(() => of({ entries: [] }))),
            threads: this.api.listThreads().pipe(catchError(() => of({ threads: [] }))),
        })
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
            next: (result) => this.state.set({
                machines: result.machines.machines,
                manuals: result.manuals.manuals,
                tickets: result.tickets.tickets,
                alerts: result.alerts.alerts,
                history: result.history.entries,
                threads: result.threads.threads,
            }),
            error: () => this.error.set('Unexpected failure while loading dashboard data.'),
        });
    }
    static { this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardComponent, selectors: [["app-dashboard"]], decls: 23, vars: 3, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "hero-meta"], [1, "meta-card"], [1, "label"], [1, "panel"], [1, "panel", "error"], ["type", "button", 1, "button", 3, "click"], [1, "stats"], [1, "stat-card"], [1, "grid"], [1, "panel-head"], [1, "list"], [1, "item"], [1, "empty"], [1, "item-main"], [1, "item-meta"]], template: function DashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Operations overview");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "h1");
            i0.ɵɵtext(6, "Dashboard");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(7, "p", 3);
            i0.ɵɵtext(8, " Summary of machines, manuals, tickets, alerts, and recent maintenance activity. ");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(9, "div", 4)(10, "div", 5)(11, "span", 6);
            i0.ɵɵtext(12, "User");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(13, "strong");
            i0.ɵɵtext(14);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(15, "div", 5)(16, "span", 6);
            i0.ɵɵtext(17, "Role");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(18, "strong");
            i0.ɵɵtext(19);
            i0.ɵɵdomElementEnd()()()();
            i0.ɵɵconditionalCreate(20, DashboardComponent_Conditional_20_Template, 2, 0, "div", 7)(21, DashboardComponent_Conditional_21_Template, 7, 1, "div", 8)(22, DashboardComponent_Conditional_22_Template, 62, 12);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance(14);
            i0.ɵɵtextInterpolate(((tmp_0_0 = ctx.auth.user()) == null ? null : tmp_0_0.email) || "Signed in");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.auth.claims().role || "unassigned");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading() ? 20 : ctx.error() ? 21 : 22);
        } }, dependencies: [CommonModule], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 20px;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%], \n   .stat-card[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n        padding: 20px;\n      }\n      .eyebrow[_ngcontent-%COMP%], \n   .label[_ngcontent-%COMP%], \n   .item-meta[_ngcontent-%COMP%], \n   .empty[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      h1[_ngcontent-%COMP%], \n   h2[_ngcontent-%COMP%], \n   p[_ngcontent-%COMP%] {\n        margin: 0;\n      }\n      .lede[_ngcontent-%COMP%] {\n        margin-top: 6px;\n        max-width: 60ch;\n        color: #374151;\n      }\n      .hero-meta[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n        min-width: 240px;\n      }\n      .meta-card[_ngcontent-%COMP%], \n   .stat-card[_ngcontent-%COMP%] {\n        padding: 14px;\n        display: grid;\n        gap: 4px;\n      }\n      .stats[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n      }\n      .stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n        font-size: 28px;\n      }\n      .grid[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n      }\n      .panel[_ngcontent-%COMP%] {\n        padding: 16px;\n      }\n      .panel-head[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 12px;\n      }\n      .list[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 10px;\n      }\n      .item[_ngcontent-%COMP%] {\n        padding: 12px;\n        border-radius: 12px;\n        background: #f9fafb;\n        display: grid;\n        gap: 8px;\n      }\n      .item-main[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 4px;\n      }\n      .item-meta[_ngcontent-%COMP%] {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      .panel.error[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n      .button[_ngcontent-%COMP%] {\n        justify-self: start;\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .empty[_ngcontent-%COMP%] {\n        padding: 8px 0;\n      }\n      @media (max-width: 760px) {\n        .hero[_ngcontent-%COMP%] {\n          flex-direction: column;\n        }\n        .hero-meta[_ngcontent-%COMP%] {\n          min-width: 0;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardComponent, [{
        type: Component,
        args: [{ selector: 'app-dashboard', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Operations overview</p>
          <h1>Dashboard</h1>
          <p class="lede">
            Summary of machines, manuals, tickets, alerts, and recent maintenance activity.
          </p>
        </div>
        <div class="hero-meta">
          <div class="meta-card">
            <span class="label">User</span>
            <strong>{{ auth.user()?.email || 'Signed in' }}</strong>
          </div>
          <div class="meta-card">
            <span class="label">Role</span>
            <strong>{{ auth.claims().role || 'unassigned' }}</strong>
          </div>
        </div>
      </header>

      @if (loading()) {
        <div class="panel">Loading dashboard data...</div>
      } @else if (error()) {
        <div class="panel error">
          <strong>Could not load data.</strong>
          <span>{{ error() }}</span>
          <button type="button" class="button" (click)="load()">Retry</button>
        </div>
      } @else {
        <div class="stats">
          <article class="stat-card">
            <span class="label">Machines</span>
            <strong>{{ summary().machines }}</strong>
          </article>
          <article class="stat-card">
            <span class="label">Manuals indexed</span>
            <strong>{{ summary().indexedManuals }}</strong>
          </article>
          <article class="stat-card">
            <span class="label">Open tickets</span>
            <strong>{{ summary().openTickets }}</strong>
          </article>
          <article class="stat-card">
            <span class="label">Active alerts</span>
            <strong>{{ summary().activeAlerts }}</strong>
          </article>
          <article class="stat-card">
            <span class="label">Fix logs</span>
            <strong>{{ summary().historyEntries }}</strong>
          </article>
          <article class="stat-card">
            <span class="label">Chat threads</span>
            <strong>{{ summary().threads }}</strong>
          </article>
        </div>

        <div class="grid">
          <section class="panel">
            <div class="panel-head">
              <h2>Tickets</h2>
              <span>{{ tickets().length }} total</span>
            </div>
            <div class="list">
              @for (ticket of tickets().slice(0, 5); track ticket.id) {
                <article class="item">
                  <div class="item-main">
                    <strong>{{ ticket.title }}</strong>
                    <p>{{ ticket.description }}</p>
                  </div>
                  <div class="item-meta">
                    <span>{{ ticket.status }}</span>
                    <span>{{ ticket.priority }}</span>
                    <span>{{ ticket.machineId }}</span>
                  </div>
                </article>
              } @empty {
                <p class="empty">No tickets yet.</p>
              }
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <h2>Alerts</h2>
              <span>{{ alerts().length }} total</span>
            </div>
            <div class="list">
              @for (alert of alerts().slice(0, 5); track alert.id) {
                <article class="item">
                  <div class="item-main">
                    <strong>{{ alert.title }}</strong>
                    <p>{{ alert.detail }}</p>
                  </div>
                  <div class="item-meta">
                    <span>{{ alert.kind }}</span>
                    <span>{{ alert.status }}</span>
                    <span>{{ alert.machineName || alert.machineId }}</span>
                  </div>
                </article>
              } @empty {
                <p class="empty">No alerts queued.</p>
              }
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <h2>Recent fixes</h2>
              <span>{{ history().length }} logged</span>
            </div>
            <div class="list">
              @for (entry of history().slice(0, 5); track entry.id) {
                <article class="item">
                  <div class="item-main">
                    <strong>{{ entry.title }}</strong>
                    <p>{{ entry.resolution }}</p>
                  </div>
                  <div class="item-meta">
                    <span>{{ entry.machineId }}</span>
                    <span>{{ entry.technicianUid }}</span>
                    <span>{{ entry.occurredAt || 'recent' }}</span>
                  </div>
                </article>
              } @empty {
                <p class="empty">No maintenance log entries yet.</p>
              }
            </div>
          </section>
        </div>
      }
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 20px;\n      }\n      .hero,\n      .panel,\n      .stat-card {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n        padding: 20px;\n      }\n      .eyebrow,\n      .label,\n      .item-meta,\n      .empty {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      h1,\n      h2,\n      p {\n        margin: 0;\n      }\n      .lede {\n        margin-top: 6px;\n        max-width: 60ch;\n        color: #374151;\n      }\n      .hero-meta {\n        display: grid;\n        gap: 12px;\n        min-width: 240px;\n      }\n      .meta-card,\n      .stat-card {\n        padding: 14px;\n        display: grid;\n        gap: 4px;\n      }\n      .stats {\n        display: grid;\n        gap: 12px;\n        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n      }\n      .stat-card strong {\n        font-size: 28px;\n      }\n      .grid {\n        display: grid;\n        gap: 16px;\n        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n      }\n      .panel {\n        padding: 16px;\n      }\n      .panel-head {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 12px;\n      }\n      .list {\n        display: grid;\n        gap: 10px;\n      }\n      .item {\n        padding: 12px;\n        border-radius: 12px;\n        background: #f9fafb;\n        display: grid;\n        gap: 8px;\n      }\n      .item-main {\n        display: grid;\n        gap: 4px;\n      }\n      .item-meta {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      .panel.error {\n        display: grid;\n        gap: 12px;\n      }\n      .button {\n        justify-self: start;\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .empty {\n        padding: 8px 0;\n      }\n      @media (max-width: 760px) {\n        .hero {\n          flex-direction: column;\n        }\n        .hero-meta {\n          min-width: 0;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 279 }); })();
