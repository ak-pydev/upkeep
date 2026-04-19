import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => ({ standalone: true });
const _forTrack0 = ($index, $item) => $item.id;
function TicketsComponent_For_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const machine_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", machine_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(machine_r1.name);
} }
function TicketsComponent_For_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const machine_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", machine_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(machine_r2.name);
} }
function TicketsComponent_Conditional_74_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1, "Loading tickets...");
    i0.ɵɵelementEnd();
} }
function TicketsComponent_Conditional_75_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.error());
} }
function TicketsComponent_Conditional_76_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 32)(1, "div", 33)(2, "div")(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "span", 34);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 35)(10, "span");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "label", 36);
    i0.ɵɵtext(19, " Close resolution ");
    i0.ɵɵelementStart(20, "textarea", 37);
    i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Conditional_76_For_2_Template_textarea_ngModelChange_20_listener($event) { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r2.closeNotes[ticket_r5.id], $event) || (ctx_r2.closeNotes[ticket_r5.id] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 38)(22, "button", 14);
    i0.ɵɵlistener("click", function TicketsComponent_Conditional_76_For_2_Template_button_click_22_listener() { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateStatus(ticket_r5, "in_progress")); });
    i0.ɵɵtext(23, " In progress ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 14);
    i0.ɵɵlistener("click", function TicketsComponent_Conditional_76_For_2_Template_button_click_24_listener() { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateStatus(ticket_r5, "awaiting_parts")); });
    i0.ɵɵtext(25, " Awaiting parts ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "button", 14);
    i0.ɵɵlistener("click", function TicketsComponent_Conditional_76_For_2_Template_button_click_26_listener() { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateStatus(ticket_r5, "resolved")); });
    i0.ɵɵtext(27, " Resolve ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "button", 39);
    i0.ɵɵlistener("click", function TicketsComponent_Conditional_76_For_2_Template_button_click_28_listener() { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.closeTicket(ticket_r5)); });
    i0.ɵɵtext(29, "Close");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ticket_r5 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ticket_r5.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r5.description);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r5.status);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ticket_r5.machineId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r5.priority);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r5.createdAt || "recent");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r5.mttrMinutes ? ticket_r5.mttrMinutes + " min MTTR" : "no MTTR yet");
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.closeNotes[ticket_r5.id]);
    i0.ɵɵproperty("ngModelOptions", i0.ɵɵpureFunction0(9, _c0));
} }
function TicketsComponent_Conditional_76_ForEmpty_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1, "No tickets match the current filters.");
    i0.ɵɵelementEnd();
} }
function TicketsComponent_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31);
    i0.ɵɵrepeaterCreate(1, TicketsComponent_Conditional_76_For_2_Template, 30, 10, "article", 32, _forTrack0, false, TicketsComponent_Conditional_76_ForEmpty_3_Template, 2, 0, "p", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.tickets());
} }
export class TicketsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        this.working = signal(false, ...(ngDevMode ? [{ debugName: "working" }] : []));
        this.machines = signal([], ...(ngDevMode ? [{ debugName: "machines" }] : []));
        this.tickets = signal([], ...(ngDevMode ? [{ debugName: "tickets" }] : []));
        this.statusFilter = '';
        this.machineFilter = '';
        this.draft = {
            machineId: '',
            title: '',
            description: '',
            priority: 'normal',
        };
        this.closeNotes = {};
    }
    ngOnInit() {
        this.load();
        this.loadMachines();
    }
    loadMachines() {
        this.api.listMachines().pipe(catchError(() => of({ machines: [] }))).subscribe({
            next: (result) => this.machines.set(result.machines),
        });
    }
    load() {
        this.loading.set(true);
        this.error.set(null);
        const params = {
            status: this.statusFilter || undefined,
            machineId: this.machineFilter || undefined,
        };
        this.api
            .listTickets(params)
            .pipe(catchError(() => {
            this.error.set('Could not load tickets.');
            return of({ tickets: [] });
        }), finalize(() => this.loading.set(false)))
            .subscribe((result) => {
            this.tickets.set(result.tickets);
            for (const ticket of result.tickets) {
                if (!this.closeNotes[ticket.id]) {
                    this.closeNotes[ticket.id] = ticket.description;
                }
            }
        });
    }
    resetFilters() {
        this.statusFilter = '';
        this.machineFilter = '';
        this.load();
    }
    createTicket() {
        if (!this.draft.machineId || !this.draft.title.trim() || !this.draft.description.trim()) {
            return;
        }
        this.working.set(true);
        this.api
            .createTicket({
            machineId: this.draft.machineId,
            title: this.draft.title.trim(),
            description: this.draft.description.trim(),
            priority: this.draft.priority,
            status: 'open',
        })
            .pipe(finalize(() => this.working.set(false)))
            .subscribe({
            next: () => {
                this.draft = { machineId: '', title: '', description: '', priority: 'normal' };
                this.load();
            },
            error: () => this.error.set('Could not create the ticket.'),
        });
    }
    updateStatus(ticket, status) {
        this.working.set(true);
        this.api
            .updateTicket(ticket.id, { status })
            .pipe(finalize(() => this.working.set(false)))
            .subscribe({
            next: () => this.load(),
            error: () => this.error.set(`Could not update ${ticket.title}.`),
        });
    }
    closeTicket(ticket) {
        this.working.set(true);
        this.api
            .closeTicket(ticket.id, {
            resolution: this.closeNotes[ticket.id] || ticket.description,
            logToHistory: true,
        })
            .pipe(finalize(() => this.working.set(false)))
            .subscribe({
            next: () => this.load(),
            error: () => this.error.set(`Could not close ${ticket.title}.`),
        });
    }
    static { this.ɵfac = function TicketsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TicketsComponent, selectors: [["app-tickets"]], decls: 77, vars: 9, consts: [[1, "page"], [1, "hero"], [1, "eyebrow"], [1, "lede"], [1, "filters"], ["name", "statusFilter", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "open"], ["value", "in_progress"], ["value", "awaiting_parts"], ["value", "resolved"], ["value", "closed"], ["name", "machineFilter", 3, "ngModelChange", "change", "ngModel"], [3, "value"], ["type", "button", 1, "button", "secondary", 3, "click"], [1, "layout"], [1, "panel"], [1, "panel-head"], [1, "form", 3, "ngSubmit"], ["name", "machineId", "required", "", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", ""], ["name", "title", "placeholder", "Spindle fault", "required", "", 3, "ngModelChange", "ngModel"], ["name", "description", "rows", "4", "placeholder", "What failed, what you saw, and any immediate notes", "required", "", 3, "ngModelChange", "ngModel"], ["name", "priority", 3, "ngModelChange", "ngModel"], ["value", "low"], ["value", "normal"], ["value", "high"], ["value", "critical"], ["type", "submit", 1, "button", 3, "disabled"], [1, "empty"], [1, "empty", "error"], [1, "list"], [1, "ticket"], [1, "ticket-head"], [1, "status"], [1, "meta"], [1, "resolution"], ["rows", "2", "placeholder", "Resolution note for the history log", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "actions"], ["type", "button", 1, "button", 3, "click"]], template: function TicketsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Repair workflow");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Tickets");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, "Create, triage, and close repair tickets from a single list.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 4)(10, "label");
            i0.ɵɵtext(11, " Status ");
            i0.ɵɵelementStart(12, "select", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_select_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event); return $event; });
            i0.ɵɵlistener("change", function TicketsComponent_Template_select_change_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "option", 6);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "option", 7);
            i0.ɵɵtext(16, "Open");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "option", 8);
            i0.ɵɵtext(18, "In progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "option", 9);
            i0.ɵɵtext(20, "Awaiting parts");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "option", 10);
            i0.ɵɵtext(22, "Resolved");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "option", 11);
            i0.ɵɵtext(24, "Closed");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(25, "label");
            i0.ɵɵtext(26, " Machine ");
            i0.ɵɵelementStart(27, "select", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_select_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.machineFilter, $event) || (ctx.machineFilter = $event); return $event; });
            i0.ɵɵlistener("change", function TicketsComponent_Template_select_change_27_listener() { return ctx.load(); });
            i0.ɵɵelementStart(28, "option", 6);
            i0.ɵɵtext(29, "All machines");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(30, TicketsComponent_For_31_Template, 2, 2, "option", 13, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "button", 14);
            i0.ɵɵlistener("click", function TicketsComponent_Template_button_click_32_listener() { return ctx.resetFilters(); });
            i0.ɵɵtext(33, "Reset");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(34, "div", 15)(35, "section", 16)(36, "div", 17)(37, "h2");
            i0.ɵɵtext(38, "New ticket");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "span");
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "form", 18);
            i0.ɵɵlistener("ngSubmit", function TicketsComponent_Template_form_ngSubmit_41_listener() { return ctx.createTicket(); });
            i0.ɵɵelementStart(42, "label");
            i0.ɵɵtext(43, " Machine ");
            i0.ɵɵelementStart(44, "select", 19);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_select_ngModelChange_44_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.machineId, $event) || (ctx.draft.machineId = $event); return $event; });
            i0.ɵɵelementStart(45, "option", 20);
            i0.ɵɵtext(46, "Select a machine");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(47, TicketsComponent_For_48_Template, 2, 2, "option", 13, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(49, "label");
            i0.ɵɵtext(50, " Title ");
            i0.ɵɵelementStart(51, "input", 21);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_input_ngModelChange_51_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.title, $event) || (ctx.draft.title = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "label");
            i0.ɵɵtext(53, " Description ");
            i0.ɵɵelementStart(54, "textarea", 22);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_textarea_ngModelChange_54_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.description, $event) || (ctx.draft.description = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "label");
            i0.ɵɵtext(56, " Priority ");
            i0.ɵɵelementStart(57, "select", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function TicketsComponent_Template_select_ngModelChange_57_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.priority, $event) || (ctx.draft.priority = $event); return $event; });
            i0.ɵɵelementStart(58, "option", 24);
            i0.ɵɵtext(59, "Low");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "option", 25);
            i0.ɵɵtext(61, "Normal");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "option", 26);
            i0.ɵɵtext(63, "High");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "option", 27);
            i0.ɵɵtext(65, "Critical");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(66, "button", 28);
            i0.ɵɵtext(67, " Create ticket ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(68, "section", 16)(69, "div", 17)(70, "h2");
            i0.ɵɵtext(71, "Ticket list");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "button", 14);
            i0.ɵɵlistener("click", function TicketsComponent_Template_button_click_72_listener() { return ctx.load(); });
            i0.ɵɵtext(73, "Refresh");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(74, TicketsComponent_Conditional_74_Template, 2, 0, "p", 29)(75, TicketsComponent_Conditional_75_Template, 2, 1, "p", 30)(76, TicketsComponent_Conditional_76_Template, 4, 1, "div", 31);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("ngModel", ctx.statusFilter);
            i0.ɵɵadvance(15);
            i0.ɵɵtwoWayProperty("ngModel", ctx.machineFilter);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.machines());
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate1("", ctx.tickets().length, " visible");
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.machineId);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.machines());
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.title);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.description);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.priority);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("disabled", ctx.working() || !ctx.draft.machineId);
            i0.ɵɵadvance(8);
            i0.ɵɵconditional(ctx.loading() ? 74 : ctx.error() ? 75 : 76);
        } }, dependencies: [CommonModule, FormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.RequiredValidator, i1.NgModel, i1.NgForm], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%], \n   .ticket[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero[_ngcontent-%COMP%], \n   .panel[_ngcontent-%COMP%] {\n        padding: 16px;\n      }\n      .hero[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .filters[_ngcontent-%COMP%], \n   .layout[_ngcontent-%COMP%], \n   .list[_ngcontent-%COMP%], \n   .form[_ngcontent-%COMP%], \n   .ticket[_ngcontent-%COMP%], \n   .actions[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n      .layout[_ngcontent-%COMP%] {\n        grid-template-columns: 360px minmax(0, 1fr);\n      }\n      .eyebrow[_ngcontent-%COMP%], \n   .lede[_ngcontent-%COMP%], \n   .empty[_ngcontent-%COMP%], \n   .meta[_ngcontent-%COMP%], \n   .status[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head[_ngcontent-%COMP%], \n   .ticket-head[_ngcontent-%COMP%], \n   .actions[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .ticket[_ngcontent-%COMP%] {\n        padding: 14px;\n      }\n      .meta[_ngcontent-%COMP%] {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      label[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n        font-size: 14px;\n      }\n      input[_ngcontent-%COMP%], \n   select[_ngcontent-%COMP%], \n   textarea[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary[_ngcontent-%COMP%] {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .status[_ngcontent-%COMP%] {\n        text-transform: uppercase;\n        letter-spacing: 0.04em;\n      }\n      .resolution[_ngcontent-%COMP%] {\n        margin-top: 4px;\n      }\n      .empty.error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n      @media (max-width: 960px) {\n        .layout[_ngcontent-%COMP%], \n   .hero[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketsComponent, [{
        type: Component,
        args: [{ selector: 'app-tickets', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Repair workflow</p>
          <h1>Tickets</h1>
          <p class="lede">Create, triage, and close repair tickets from a single list.</p>
        </div>
        <div class="filters">
          <label>
            Status
            <select [(ngModel)]="statusFilter" name="statusFilter" (change)="load()">
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="awaiting_parts">Awaiting parts</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label>
            Machine
            <select [(ngModel)]="machineFilter" name="machineFilter" (change)="load()">
              <option value="">All machines</option>
              @for (machine of machines(); track machine.id) {
                <option [value]="machine.id">{{ machine.name }}</option>
              }
            </select>
          </label>
          <button type="button" class="button secondary" (click)="resetFilters()">Reset</button>
        </div>
      </header>

      <div class="layout">
        <section class="panel">
          <div class="panel-head">
            <h2>New ticket</h2>
            <span>{{ tickets().length }} visible</span>
          </div>

          <form class="form" (ngSubmit)="createTicket()">
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
              <input [(ngModel)]="draft.title" name="title" placeholder="Spindle fault" required />
            </label>
            <label>
              Description
              <textarea
                [(ngModel)]="draft.description"
                name="description"
                rows="4"
                placeholder="What failed, what you saw, and any immediate notes"
                required
              ></textarea>
            </label>
            <label>
              Priority
              <select [(ngModel)]="draft.priority" name="priority">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <button type="submit" class="button" [disabled]="working() || !draft.machineId">
              Create ticket
            </button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Ticket list</h2>
            <button type="button" class="button secondary" (click)="load()">Refresh</button>
          </div>

          @if (loading()) {
            <p class="empty">Loading tickets...</p>
          } @else if (error()) {
            <p class="empty error">{{ error() }}</p>
          } @else {
            <div class="list">
              @for (ticket of tickets(); track ticket.id) {
                <article class="ticket">
                  <div class="ticket-head">
                    <div>
                      <strong>{{ ticket.title }}</strong>
                      <p>{{ ticket.description }}</p>
                    </div>
                    <span class="status">{{ ticket.status }}</span>
                  </div>

                  <div class="meta">
                    <span>{{ ticket.machineId }}</span>
                    <span>{{ ticket.priority }}</span>
                    <span>{{ ticket.createdAt || 'recent' }}</span>
                    <span>{{ ticket.mttrMinutes ? ticket.mttrMinutes + ' min MTTR' : 'no MTTR yet' }}</span>
                  </div>

                  <label class="resolution">
                    Close resolution
                    <textarea
                      [(ngModel)]="closeNotes[ticket.id]"
                      [ngModelOptions]="{ standalone: true }"
                      rows="2"
                      placeholder="Resolution note for the history log"
                    ></textarea>
                  </label>

                  <div class="actions">
                    <button type="button" class="button secondary" (click)="updateStatus(ticket, 'in_progress')">
                      In progress
                    </button>
                    <button type="button" class="button secondary" (click)="updateStatus(ticket, 'awaiting_parts')">
                      Awaiting parts
                    </button>
                    <button type="button" class="button secondary" (click)="updateStatus(ticket, 'resolved')">
                      Resolve
                    </button>
                    <button type="button" class="button" (click)="closeTicket(ticket)">Close</button>
                  </div>
                </article>
              } @empty {
                <p class="empty">No tickets match the current filters.</p>
              }
            </div>
          }
        </section>
      </div>
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 16px;\n      }\n      .hero,\n      .panel,\n      .ticket {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: white;\n      }\n      .hero,\n      .panel {\n        padding: 16px;\n      }\n      .hero {\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      }\n      .filters,\n      .layout,\n      .list,\n      .form,\n      .ticket,\n      .actions {\n        display: grid;\n        gap: 12px;\n      }\n      .layout {\n        grid-template-columns: 360px minmax(0, 1fr);\n      }\n      .eyebrow,\n      .lede,\n      .empty,\n      .meta,\n      .status {\n        color: #6b7280;\n        font-size: 12px;\n      }\n      .panel-head,\n      .ticket-head,\n      .actions {\n        display: flex;\n        justify-content: space-between;\n        gap: 12px;\n      }\n      .ticket {\n        padding: 14px;\n      }\n      .meta {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n      label {\n        display: grid;\n        gap: 6px;\n        font-size: 14px;\n      }\n      input,\n      select,\n      textarea {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: white;\n      }\n      .button {\n        border: 0;\n        border-radius: 999px;\n        padding: 10px 14px;\n        background: var(--upkeep-primary);\n        color: white;\n        cursor: pointer;\n      }\n      .button.secondary {\n        background: #e5e7eb;\n        color: #111827;\n      }\n      .status {\n        text-transform: uppercase;\n        letter-spacing: 0.04em;\n      }\n      .resolution {\n        margin-top: 4px;\n      }\n      .empty.error {\n        color: #b91c1c;\n      }\n      @media (max-width: 960px) {\n        .layout,\n        .hero {\n          grid-template-columns: 1fr;\n          flex-direction: column;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TicketsComponent, { className: "TicketsComponent", filePath: "src/app/features/tickets/tickets.component.ts", lineNumber: 255 }); })();
