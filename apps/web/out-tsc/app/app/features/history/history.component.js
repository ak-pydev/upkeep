import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function HistoryComponent_For_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const machine_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", machine_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(machine_r1.name);
} }
function HistoryComponent_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 18);
    i0.ɵɵtext(1, "Loading history...");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function HistoryComponent_Conditional_51_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 21)(1, "div", 22)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "p", 23);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 24)(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const entry_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r3.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.occurredAt || "recent");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.issue);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.resolution);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.machineName(entry_r3.machineId));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.technicianUid || "system");
} }
function HistoryComponent_Conditional_51_ForEmpty_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 18);
    i0.ɵɵtext(1, "No log entries found.");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵrepeaterCreate(1, HistoryComponent_Conditional_51_For_2_Template, 15, 6, "article", 21, _forTrack0, false, HistoryComponent_Conditional_51_ForEmpty_3_Template, 2, 0, "p", 18);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.entries());
} }
export class HistoryComponent {
    constructor() {
        this.api = inject(ApiService);
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.working = signal(false, ...(ngDevMode ? [{ debugName: "working" }] : []));
        this.machines = signal([], ...(ngDevMode ? [{ debugName: "machines" }] : []));
        this.entries = signal([], ...(ngDevMode ? [{ debugName: "entries" }] : []));
        this.query = '';
        this.draft = {
            machineId: '',
            title: '',
            issue: '',
            resolution: '',
        };
    }
    ngOnInit() {
        this.loadMachines();
        this.load();
    }
    loadMachines() {
        this.api.listMachines().pipe(catchError(() => of({ machines: [] }))).subscribe({
            next: (result) => this.machines.set(result.machines),
        });
    }
    load() {
        this.loading.set(true);
        this.error.set(null);
        this.api
            .listLog()
            .pipe(catchError(() => {
            this.error.set('Could not load history.');
            return of({ entries: [] });
        }), finalize(() => this.loading.set(false)))
            .subscribe((result) => this.entries.set(result.entries));
    }
    search() {
        const q = this.query.trim();
        if (!q) {
            this.load();
            return;
        }
        this.loading.set(true);
        this.error.set(null);
        this.api
            .searchLog(q)
            .pipe(catchError(() => {
            this.error.set('Could not search history.');
            return of({ results: [] });
        }), finalize(() => this.loading.set(false)))
            .subscribe((result) => this.entries.set(result.results));
    }
    clearSearch() {
        this.query = '';
        this.load();
    }
    createEntry() {
        if (!this.draft.machineId || !this.draft.title.trim()) {
            return;
        }
        this.working.set(true);
        this.api
            .createLog({
            ...this.draft,
            title: this.draft.title.trim(),
            issue: this.draft.issue.trim(),
            resolution: this.draft.resolution.trim(),
            occurredAt: new Date().toISOString(),
        })
            .pipe(finalize(() => this.working.set(false)))
            .subscribe({
            next: () => {
                this.draft = { machineId: '', title: '', issue: '', resolution: '' };
                this.load();
            },
            error: () => this.error.set('Could not save the maintenance log entry.'),
        });
    }
    machineName(machineId) {
        return this.machines().find((machine) => machine.id === machineId)?.name || machineId;
    }
    static { this.ɵfac = function HistoryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HistoryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HistoryComponent, selectors: [["app-history"]], decls: 52, vars: 9, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "toolbar"], ["name", "query", "placeholder", "Spindle, encoder, coolant...", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "button", "secondary", 3, "click"], [1, "layout"], [1, "panel"], [1, "panel-head"], [1, "form", 3, "ngSubmit"], ["name", "machineId", "required", "", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", ""], [3, "value"], ["name", "title", "placeholder", "Encoder cable replaced", "required", "", 3, "ngModelChange", "ngModel"], ["name", "issue", "rows", "3", "required", "", 3, "ngModelChange", "ngModel"], ["name", "resolution", "rows", "3", "required", "", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "button", 3, "disabled"], [1, "empty"], [1, "empty", "error"], [1, "list"], [1, "entry"], [1, "entry-head"], [1, "issue"], [1, "meta"]], template: function HistoryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Maintenance log");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "History");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, "Search and record resolved issues so the next fix is faster.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 4)(10, "label");
            i0.ɵɵtext(11, " Search ");
            i0.ɵɵelementStart(12, "input", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function HistoryComponent_Template_input_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.query, $event) || (ctx.query = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "button", 6);
            i0.ɵɵlistener("click", function HistoryComponent_Template_button_click_13_listener() { return ctx.search(); });
            i0.ɵɵtext(14, "Search");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 6);
            i0.ɵɵlistener("click", function HistoryComponent_Template_button_click_15_listener() { return ctx.clearSearch(); });
            i0.ɵɵtext(16, "Clear");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "div", 7)(18, "section", 8)(19, "div", 9)(20, "h2");
            i0.ɵɵtext(21, "Log a fix");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 6);
            i0.ɵɵlistener("click", function HistoryComponent_Template_button_click_22_listener() { return ctx.load(); });
            i0.ɵɵtext(23, "Refresh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "form", 10);
            i0.ɵɵlistener("ngSubmit", function HistoryComponent_Template_form_ngSubmit_24_listener() { return ctx.createEntry(); });
            i0.ɵɵelementStart(25, "label");
            i0.ɵɵtext(26, " Machine ");
            i0.ɵɵelementStart(27, "select", 11);
            i0.ɵɵtwoWayListener("ngModelChange", function HistoryComponent_Template_select_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.machineId, $event) || (ctx.draft.machineId = $event); return $event; });
            i0.ɵɵelementStart(28, "option", 12);
            i0.ɵɵtext(29, "Select a machine");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(30, HistoryComponent_For_31_Template, 2, 2, "option", 13, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "label");
            i0.ɵɵtext(33, " Title ");
            i0.ɵɵelementStart(34, "input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function HistoryComponent_Template_input_ngModelChange_34_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.title, $event) || (ctx.draft.title = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "label");
            i0.ɵɵtext(36, " Issue ");
            i0.ɵɵelementStart(37, "textarea", 15);
            i0.ɵɵtwoWayListener("ngModelChange", function HistoryComponent_Template_textarea_ngModelChange_37_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.issue, $event) || (ctx.draft.issue = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "label");
            i0.ɵɵtext(39, " Resolution ");
            i0.ɵɵelementStart(40, "textarea", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function HistoryComponent_Template_textarea_ngModelChange_40_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.resolution, $event) || (ctx.draft.resolution = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "button", 17);
            i0.ɵɵtext(42, " Save fix ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(43, "section", 8)(44, "div", 9)(45, "h2");
            i0.ɵɵtext(46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "span");
            i0.ɵɵtext(48);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(49, HistoryComponent_Conditional_49_Template, 2, 0, "p", 18)(50, HistoryComponent_Conditional_50_Template, 2, 1, "p", 19)(51, HistoryComponent_Conditional_51_Template, 4, 1, "div", 20);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("ngModel", ctx.query);
            i0.ɵɵadvance(15);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.machineId);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.machines());
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.title);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.issue);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.resolution);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.working() || !ctx.draft.machineId);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.query.trim() ? "Search results" : "Recent history");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("", ctx.entries().length, " entries");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading() ? 49 : ctx.error() ? 50 : 51);
        } }, dependencies: [CommonModule, FormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.RequiredValidator, i1.NgModel, i1.NgForm], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%], \n   .entry[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%] {\n        padding: 16px;\n      }\n      .hero[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .toolbar[_ngcontent-%COMP%], \n   .layout[_ngcontent-%COMP%], \n   .form[_ngcontent-%COMP%], \n   .list[_ngcontent-%COMP%], \n   .entry[_ngcontent-%COMP%], \n   .meta[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n      .layout[_ngcontent-%COMP%] {\n        grid-template-columns: 340px minmax(0, 1fr);\n      }\n      .eyebrow[_ngcontent-%COMP%], \n   .lede[_ngcontent-%COMP%], \n   .empty[_ngcontent-%COMP%], \n   .meta[_ngcontent-%COMP%], \n   .entry-head[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head[_ngcontent-%COMP%], \n   .entry-head[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .entry[_ngcontent-%COMP%] {\n        padding: 14px;\n      }\n      .issue[_ngcontent-%COMP%] {\n        font-weight: 600;\n      }\n      label[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n      }\n      input[_ngcontent-%COMP%], \n   select[_ngcontent-%COMP%], \n   textarea[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary[_ngcontent-%COMP%] {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .empty.error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n      @media (max-width: 960px) {\n        .layout[_ngcontent-%COMP%], \n   .hero[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HistoryComponent, [{
        type: Component,
        args: [{ selector: 'app-history', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Maintenance log</p>
          <h1>History</h1>
          <p class="lede">Search and record resolved issues so the next fix is faster.</p>
        </div>
        <div class="toolbar">
          <label>
            Search
            <input [(ngModel)]="query" name="query" placeholder="Spindle, encoder, coolant..." />
          </label>
          <button type="button" class="button secondary" (click)="search()">Search</button>
          <button type="button" class="button secondary" (click)="clearSearch()">Clear</button>
        </div>
      </header>

      <div class="layout">
        <section class="panel">
          <div class="panel-head">
            <h2>Log a fix</h2>
            <button type="button" class="button secondary" (click)="load()">Refresh</button>
          </div>

          <form class="form" (ngSubmit)="createEntry()">
            <label>
              Machine
              <select [(ngModel)]="draft.machineId" name="machineId" required>
                <option value="" disabled>Select a machine</option>
                @for (machine of machines(); track machine.id) {
                  <option [value]="machine.id">{{ machine.name }}</option>
                }
              </select>
            </label>
            <label>
              Title
              <input [(ngModel)]="draft.title" name="title" placeholder="Encoder cable replaced" required />
            </label>
            <label>
              Issue
              <textarea [(ngModel)]="draft.issue" name="issue" rows="3" required></textarea>
            </label>
            <label>
              Resolution
              <textarea [(ngModel)]="draft.resolution" name="resolution" rows="3" required></textarea>
            </label>
            <button type="submit" class="button" [disabled]="working() || !draft.machineId">
              Save fix
            </button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>{{ query.trim() ? 'Search results' : 'Recent history' }}</h2>
            <span>{{ entries().length }} entries</span>
          </div>

          @if (loading()) {
            <p class="empty">Loading history...</p>
          } @else if (error()) {
            <p class="empty error">{{ error() }}</p>
          } @else {
            <div class="list">
              @for (entry of entries(); track entry.id) {
                <article class="entry">
                  <div class="entry-head">
                    <strong>{{ entry.title }}</strong>
                    <span>{{ entry.occurredAt || 'recent' }}</span>
                  </div>
                  <p class="issue">{{ entry.issue }}</p>
                  <p>{{ entry.resolution }}</p>
                  <div class="meta">
                    <span>{{ machineName(entry.machineId) }}</span>
                    <span>{{ entry.technicianUid || 'system' }}</span>
                  </div>
                </article>
              } @empty {
                <p class="empty">No log entries found.</p>
              }
            </div>
          }
        </section>
      </div>
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 16px;\n      }\n      .hero,\n      .panel,\n      .entry {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero,\n      .panel {\n        padding: 16px;\n      }\n      .hero {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .toolbar,\n      .layout,\n      .form,\n      .list,\n      .entry,\n      .meta {\n        display: grid;\n        gap: 12px;\n      }\n      .layout {\n        grid-template-columns: 340px minmax(0, 1fr);\n      }\n      .eyebrow,\n      .lede,\n      .empty,\n      .meta,\n      .entry-head {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head,\n      .entry-head {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .entry {\n        padding: 14px;\n      }\n      .issue {\n        font-weight: 600;\n      }\n      label {\n        display: grid;\n        gap: 6px;\n      }\n      input,\n      select,\n      textarea {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .empty.error {\n        color: #b91c1c;\n      }\n      @media (max-width: 960px) {\n        .layout,\n        .hero {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HistoryComponent, { className: "HistoryComponent", filePath: "src/app/features/history/history.component.ts", lineNumber: 191 }); })();
