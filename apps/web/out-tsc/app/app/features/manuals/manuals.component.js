import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function ManualsComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Selected: ", ctx_r0.selectedFile.name);
} }
function ManualsComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.uploadError);
} }
function ManualsComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error);
} }
function ManualsComponent_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1, "Loading manuals\u2026");
    i0.ɵɵelementEnd();
} }
function ManualsComponent_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1, "No manuals uploaded yet.");
    i0.ɵɵelementEnd();
} }
function ManualsComponent_Conditional_49_For_2_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const manual_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u00B7 Machine ", manual_r3.machineId);
} }
function ManualsComponent_Conditional_49_For_2_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const manual_r3 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u00B7 ", ctx_r0.formatWhen(manual_r3.uploadedAt));
} }
function ManualsComponent_Conditional_49_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const manual_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", manual_r3.pageCount, " page(s)");
} }
function ManualsComponent_Conditional_49_For_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const manual_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u00B7 ", manual_r3.chunkCount, " chunk(s)");
} }
function ManualsComponent_Conditional_49_For_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const manual_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u00B7 ", manual_r3.error);
} }
function ManualsComponent_Conditional_49_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 21)(1, "div", 22)(2, "div", 23)(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 24);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p", 25);
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "uppercase");
    i0.ɵɵconditionalCreate(10, ManualsComponent_Conditional_49_For_2_Conditional_10_Template, 2, 1, "span");
    i0.ɵɵconditionalCreate(11, ManualsComponent_Conditional_49_For_2_Conditional_11_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "p", 25);
    i0.ɵɵconditionalCreate(13, ManualsComponent_Conditional_49_For_2_Conditional_13_Template, 2, 1, "span");
    i0.ɵɵconditionalCreate(14, ManualsComponent_Conditional_49_For_2_Conditional_14_Template, 2, 1, "span");
    i0.ɵɵconditionalCreate(15, ManualsComponent_Conditional_49_For_2_Conditional_15_Template, 2, 1, "span");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "button", 26);
    i0.ɵɵlistener("click", function ManualsComponent_Conditional_49_For_2_Template_button_click_16_listener() { const manual_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.deleteManual(manual_r3)); });
    i0.ɵɵtext(17, " Delete ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const manual_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(manual_r3.title);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r0.statusClass(manual_r3.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", manual_r3.status, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(9, 9, manual_r3.source), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(manual_r3.machineId ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(manual_r3.uploadedAt ? 11 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(manual_r3.pageCount !== undefined ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(manual_r3.chunkCount !== undefined ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(manual_r3.error ? 15 : -1);
} }
function ManualsComponent_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵrepeaterCreate(1, ManualsComponent_Conditional_49_For_2_Template, 18, 11, "article", 21, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.manuals);
} }
export class ManualsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.destroyRef = inject(DestroyRef);
        this.manuals = [];
        this.loading = false;
        this.uploadBusy = false;
        this.error = '';
        this.uploadError = '';
        this.selectedFile = null;
        this.titleControl = new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(3)],
        });
        this.machineIdControl = new FormControl('', { nonNullable: true });
        this.sourceControl = new FormControl('oem', {
            nonNullable: true,
        });
        this.loadManuals();
    }
    loadManuals() {
        this.loading = true;
        this.error = '';
        this.api
            .listManuals()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: ({ manuals }) => {
                this.manuals = manuals ?? [];
                this.loading = false;
            },
            error: () => {
                this.error = 'Unable to load manuals. Check the API connection.';
                this.loading = false;
            },
        });
    }
    onFileSelected(event) {
        const input = event.target;
        this.selectedFile = input.files?.[0] ?? null;
        this.uploadError = this.selectedFile ? '' : 'Pick a file before uploading.';
    }
    uploadManual() {
        if (this.uploadBusy) {
            return;
        }
        if (!this.selectedFile) {
            this.uploadError = 'Pick a file before uploading.';
            return;
        }
        if (this.titleControl.invalid) {
            this.titleControl.markAsTouched();
            return;
        }
        this.uploadBusy = true;
        this.uploadError = '';
        const machineId = this.machineIdControl.value.trim() || undefined;
        this.api
            .uploadManual(this.selectedFile, this.titleControl.value.trim(), machineId, this.sourceControl.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.uploadBusy = false;
                this.selectedFile = null;
                this.titleControl.setValue('');
                this.machineIdControl.setValue('');
                this.sourceControl.setValue('oem');
                this.loadManuals();
            },
            error: () => {
                this.uploadBusy = false;
                this.uploadError = 'Upload failed. Check the file and try again.';
            },
        });
    }
    deleteManual(manual) {
        if (!globalThis.confirm(`Delete manual "${manual.title}"?`)) {
            return;
        }
        this.error = '';
        this.api
            .deleteManual(manual.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.manuals = this.manuals.filter((item) => item.id !== manual.id);
            },
            error: () => {
                this.error = `Could not delete "${manual.title}".`;
            },
        });
    }
    statusClass(status) {
        return `status-${status}`;
    }
    formatWhen(value) {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
    }
    static { this.ɵfac = function ManualsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ManualsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ManualsComponent, selectors: [["app-manuals"]], decls: 50, vars: 12, consts: [[1, "page"], [1, "header"], [1, "eyebrow"], [1, "subtle"], ["type", "button", 1, "secondary", 3, "click", "disabled"], [1, "panel"], [1, "form-grid"], ["type", "text", "placeholder", "Hydraulic System Manual", 3, "formControl"], ["type", "text", "placeholder", "machine-123", 3, "formControl"], [3, "formControl"], ["value", "oem"], ["value", "internal"], [1, "file"], ["type", "file", 3, "change"], [1, "file-name"], [1, "error"], [1, "actions"], ["type", "button", 1, "primary", 3, "click", "disabled"], [1, "section-head"], [1, "count"], [1, "manual-list"], [1, "manual-card"], [1, "manual-main"], [1, "manual-title-row"], [1, "status", 3, "ngClass"], [1, "meta"], ["type", "button", 1, "danger", 3, "click"]], template: function ManualsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Manuals");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Upload, review, and delete manuals");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, " Keep the manual library current so chat and retrieval have the right source material. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 4);
            i0.ɵɵlistener("click", function ManualsComponent_Template_button_click_9_listener() { return ctx.loadManuals(); });
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "section", 5)(12, "h2");
            i0.ɵɵtext(13, "Upload manual");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div", 6)(15, "label")(16, "span");
            i0.ɵɵtext(17, "Title");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(18, "input", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "label")(20, "span");
            i0.ɵɵtext(21, "Machine ID");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(22, "input", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "label")(24, "span");
            i0.ɵɵtext(25, "Source");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "select", 9)(27, "option", 10);
            i0.ɵɵtext(28, "OEM");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "option", 11);
            i0.ɵɵtext(30, "Internal");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "label", 12)(32, "span");
            i0.ɵɵtext(33, "File");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "input", 13);
            i0.ɵɵlistener("change", function ManualsComponent_Template_input_change_34_listener($event) { return ctx.onFileSelected($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(35, ManualsComponent_Conditional_35_Template, 2, 1, "p", 14);
            i0.ɵɵconditionalCreate(36, ManualsComponent_Conditional_36_Template, 2, 1, "p", 15);
            i0.ɵɵelementStart(37, "div", 16)(38, "button", 17);
            i0.ɵɵlistener("click", function ManualsComponent_Template_button_click_38_listener() { return ctx.uploadManual(); });
            i0.ɵɵtext(39);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(40, "section", 5)(41, "div", 18)(42, "h2");
            i0.ɵɵtext(43, "Library");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "span", 19);
            i0.ɵɵtext(45);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(46, ManualsComponent_Conditional_46_Template, 2, 1, "p", 15);
            i0.ɵɵconditionalCreate(47, ManualsComponent_Conditional_47_Template, 2, 0, "p", 3)(48, ManualsComponent_Conditional_48_Template, 2, 0, "p", 3)(49, ManualsComponent_Conditional_49_Template, 3, 0, "div", 20);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("disabled", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.loading ? "Refreshing\u2026" : "Refresh", " ");
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("formControl", ctx.titleControl);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formControl", ctx.machineIdControl);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formControl", ctx.sourceControl);
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.selectedFile ? 35 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.uploadError ? 36 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.uploadBusy || ctx.titleControl.invalid || !ctx.selectedFile);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.uploadBusy ? "Uploading\u2026" : "Upload manual", " ");
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1("", ctx.manuals.length, " manual(s)");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error ? 46 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading && ctx.manuals.length === 0 ? 47 : ctx.manuals.length === 0 ? 48 : 49);
        } }, dependencies: [CommonModule, i1.NgClass, ReactiveFormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.FormControlDirective, i1.UpperCasePipe], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 20px;\n      }\n\n      .header[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n      }\n\n      .eyebrow[_ngcontent-%COMP%] {\n        margin: 0 0 6px;\n        font-size: 12px;\n        letter-spacing: 0.12em;\n        text-transform: uppercase;\n        color: #6b7280;\n      }\n\n      h1[_ngcontent-%COMP%], \n   h2[_ngcontent-%COMP%], \n   h3[_ngcontent-%COMP%], \n   p[_ngcontent-%COMP%] {\n        margin: 0;\n      }\n\n      h1[_ngcontent-%COMP%] {\n        font-size: 28px;\n        line-height: 1.15;\n      }\n\n      .subtle[_ngcontent-%COMP%], \n   .meta[_ngcontent-%COMP%] {\n        color: #6b7280;\n      }\n\n      .panel[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: #fff;\n        padding: 16px;\n      }\n\n      .section-head[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n\n      .count[_ngcontent-%COMP%] {\n        color: #6b7280;\n        font-size: 14px;\n      }\n\n      .form-grid[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n        margin-top: 12px;\n      }\n\n      label[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n      }\n\n      label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n        font-size: 13px;\n        font-weight: 600;\n      }\n\n      input[_ngcontent-%COMP%], \n   select[_ngcontent-%COMP%] {\n        width: 100%;\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: #fff;\n      }\n\n      .file[_ngcontent-%COMP%] {\n        grid-column: 1 / -1;\n      }\n\n      .actions[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: flex-end;\n        margin-top: 12px;\n      }\n\n      button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 10px;\n        padding: 10px 14px;\n        font: inherit;\n        cursor: pointer;\n      }\n\n      .primary[_ngcontent-%COMP%], \n   .secondary[_ngcontent-%COMP%], \n   .danger[_ngcontent-%COMP%] {\n        transition: opacity 120ms ease, transform 120ms ease;\n      }\n\n      .primary[_ngcontent-%COMP%] {\n        background: var(--upkeep-primary);\n        color: white;\n      }\n\n      .secondary[_ngcontent-%COMP%] {\n        background: #eef2ff;\n        color: #3730a3;\n      }\n\n      .danger[_ngcontent-%COMP%] {\n        background: #fef2f2;\n        color: #b91c1c;\n      }\n\n      button[_ngcontent-%COMP%]:disabled {\n        opacity: 0.6;\n        cursor: not-allowed;\n      }\n\n      .manual-list[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n\n      .manual-card[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n        padding: 14px;\n        border: 1px solid #e5e7eb;\n        border-radius: 14px;\n        background: #fafafa;\n      }\n\n      .manual-main[_ngcontent-%COMP%] {\n        min-width: 0;\n      }\n\n      .manual-title-row[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        flex-wrap: wrap;\n        margin-bottom: 4px;\n      }\n\n      .status[_ngcontent-%COMP%] {\n        display: inline-flex;\n        align-items: center;\n        border-radius: 999px;\n        padding: 4px 10px;\n        font-size: 12px;\n        font-weight: 600;\n        text-transform: capitalize;\n      }\n\n      .status-uploaded[_ngcontent-%COMP%] {\n        background: #e0f2fe;\n        color: #075985;\n      }\n\n      .status-parsing[_ngcontent-%COMP%] {\n        background: #fef3c7;\n        color: #92400e;\n      }\n\n      .status-indexed[_ngcontent-%COMP%] {\n        background: #dcfce7;\n        color: #166534;\n      }\n\n      .status-failed[_ngcontent-%COMP%] {\n        background: #fee2e2;\n        color: #991b1b;\n      }\n\n      .file-name[_ngcontent-%COMP%], \n   .error[_ngcontent-%COMP%] {\n        margin-top: 10px;\n      }\n\n      .error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n\n      .meta[_ngcontent-%COMP%] {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 4px;\n        font-size: 14px;\n        margin-top: 4px;\n      }\n\n      @media (max-width: 720px) {\n        .header[_ngcontent-%COMP%], \n   .manual-card[_ngcontent-%COMP%] {\n          flex-direction: column;\n        }\n\n        .form-grid[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n        }\n\n        .actions[_ngcontent-%COMP%] {\n          justify-content: stretch;\n        }\n\n        .actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n   .header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n          width: 100%;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ManualsComponent, [{
        type: Component,
        args: [{ selector: 'app-manuals', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, ReactiveFormsModule], template: `
    <section class="page">
      <header class="header">
        <div>
          <p class="eyebrow">Manuals</p>
          <h1>Upload, review, and delete manuals</h1>
          <p class="subtle">
            Keep the manual library current so chat and retrieval have the right source material.
          </p>
        </div>
        <button type="button" class="secondary" (click)="loadManuals()" [disabled]="loading">
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </header>

      <section class="panel">
        <h2>Upload manual</h2>
        <div class="form-grid">
          <label>
            <span>Title</span>
            <input
              type="text"
              [formControl]="titleControl"
              placeholder="Hydraulic System Manual"
            />
          </label>
          <label>
            <span>Machine ID</span>
            <input type="text" [formControl]="machineIdControl" placeholder="machine-123" />
          </label>
          <label>
            <span>Source</span>
            <select [formControl]="sourceControl">
              <option value="oem">OEM</option>
              <option value="internal">Internal</option>
            </select>
          </label>
          <label class="file">
            <span>File</span>
            <input type="file" (change)="onFileSelected($event)" />
          </label>
        </div>

        @if (selectedFile) {
          <p class="file-name">Selected: {{ selectedFile.name }}</p>
        }
        @if (uploadError) {
          <p class="error">{{ uploadError }}</p>
        }

        <div class="actions">
          <button
            type="button"
            class="primary"
            (click)="uploadManual()"
            [disabled]="uploadBusy || titleControl.invalid || !selectedFile"
          >
            {{ uploadBusy ? 'Uploading…' : 'Upload manual' }}
          </button>
        </div>
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Library</h2>
          <span class="count">{{ manuals.length }} manual(s)</span>
        </div>

        @if (error) {
          <p class="error">{{ error }}</p>
        }

        @if (loading && manuals.length === 0) {
          <p class="subtle">Loading manuals…</p>
        } @else if (manuals.length === 0) {
          <p class="subtle">No manuals uploaded yet.</p>
        } @else {
          <div class="manual-list">
            @for (manual of manuals; track manual.id) {
              <article class="manual-card">
                <div class="manual-main">
                  <div class="manual-title-row">
                    <h3>{{ manual.title }}</h3>
                    <span class="status" [ngClass]="statusClass(manual.status)">
                      {{ manual.status }}
                    </span>
                  </div>
                  <p class="meta">
                    {{ manual.source | uppercase }}
                    @if (manual.machineId) {
                      <span>· Machine {{ manual.machineId }}</span>
                    }
                    @if (manual.uploadedAt) {
                      <span>· {{ formatWhen(manual.uploadedAt) }}</span>
                    }
                  </p>
                  <p class="meta">
                    @if (manual.pageCount !== undefined) {
                      <span>{{ manual.pageCount }} page(s)</span>
                    }
                    @if (manual.chunkCount !== undefined) {
                      <span>· {{ manual.chunkCount }} chunk(s)</span>
                    }
                    @if (manual.error) {
                      <span>· {{ manual.error }}</span>
                    }
                  </p>
                </div>
                <button type="button" class="danger" (click)="deleteManual(manual)">
                  Delete
                </button>
              </article>
            }
          </div>
        }
      </section>
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 20px;\n      }\n\n      .header {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n      }\n\n      .eyebrow {\n        margin: 0 0 6px;\n        font-size: 12px;\n        letter-spacing: 0.12em;\n        text-transform: uppercase;\n        color: #6b7280;\n      }\n\n      h1,\n      h2,\n      h3,\n      p {\n        margin: 0;\n      }\n\n      h1 {\n        font-size: 28px;\n        line-height: 1.15;\n      }\n\n      .subtle,\n      .meta {\n        color: #6b7280;\n      }\n\n      .panel {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: #fff;\n        padding: 16px;\n      }\n\n      .section-head {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n\n      .count {\n        color: #6b7280;\n        font-size: 14px;\n      }\n\n      .form-grid {\n        display: grid;\n        gap: 12px;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n        margin-top: 12px;\n      }\n\n      label {\n        display: grid;\n        gap: 6px;\n      }\n\n      label span {\n        font-size: 13px;\n        font-weight: 600;\n      }\n\n      input,\n      select {\n        width: 100%;\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: #fff;\n      }\n\n      .file {\n        grid-column: 1 / -1;\n      }\n\n      .actions {\n        display: flex;\n        justify-content: flex-end;\n        margin-top: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 10px;\n        padding: 10px 14px;\n        font: inherit;\n        cursor: pointer;\n      }\n\n      .primary,\n      .secondary,\n      .danger {\n        transition: opacity 120ms ease, transform 120ms ease;\n      }\n\n      .primary {\n        background: var(--upkeep-primary);\n        color: white;\n      }\n\n      .secondary {\n        background: #eef2ff;\n        color: #3730a3;\n      }\n\n      .danger {\n        background: #fef2f2;\n        color: #b91c1c;\n      }\n\n      button:disabled {\n        opacity: 0.6;\n        cursor: not-allowed;\n      }\n\n      .manual-list {\n        display: grid;\n        gap: 12px;\n      }\n\n      .manual-card {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n        padding: 14px;\n        border: 1px solid #e5e7eb;\n        border-radius: 14px;\n        background: #fafafa;\n      }\n\n      .manual-main {\n        min-width: 0;\n      }\n\n      .manual-title-row {\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        flex-wrap: wrap;\n        margin-bottom: 4px;\n      }\n\n      .status {\n        display: inline-flex;\n        align-items: center;\n        border-radius: 999px;\n        padding: 4px 10px;\n        font-size: 12px;\n        font-weight: 600;\n        text-transform: capitalize;\n      }\n\n      .status-uploaded {\n        background: #e0f2fe;\n        color: #075985;\n      }\n\n      .status-parsing {\n        background: #fef3c7;\n        color: #92400e;\n      }\n\n      .status-indexed {\n        background: #dcfce7;\n        color: #166534;\n      }\n\n      .status-failed {\n        background: #fee2e2;\n        color: #991b1b;\n      }\n\n      .file-name,\n      .error {\n        margin-top: 10px;\n      }\n\n      .error {\n        color: #b91c1c;\n      }\n\n      .meta {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 4px;\n        font-size: 14px;\n        margin-top: 4px;\n      }\n\n      @media (max-width: 720px) {\n        .header,\n        .manual-card {\n          flex-direction: column;\n        }\n\n        .form-grid {\n          grid-template-columns: 1fr;\n        }\n\n        .actions {\n          justify-content: stretch;\n        }\n\n        .actions button,\n        .header button {\n          width: 100%;\n        }\n      }\n    "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ManualsComponent, { className: "ManualsComponent", filePath: "src/app/features/manuals/manuals.component.ts", lineNumber: 357 }); })();
