import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.manualId + ":" + $item.page;
const _forTrack2 = ($index, $item) => $item.partNumber;
function ChatComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.threadsError);
} }
function ChatComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1, "Loading threads\u2026");
    i0.ɵɵelementEnd();
} }
function ChatComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1, "No saved threads yet.");
    i0.ɵɵelementEnd();
} }
function ChatComponent_Conditional_24_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 24);
    i0.ɵɵlistener("click", function ChatComponent_Conditional_24_For_2_Template_button_click_0_listener() { const thread_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openThread(thread_r3.id)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const thread_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("active", thread_r3.id === ctx_r0.currentThreadId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(thread_r3.title || "Untitled thread");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(thread_r3.machineId || "No machine linked");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.formatWhen(thread_r3.updatedAt));
} }
function ChatComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵrepeaterCreate(1, ChatComponent_Conditional_24_For_2_Template, 7, 5, "button", 23, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.threads);
} }
function ChatComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" Thread ", ctx_r0.currentThreadId, " ");
} }
function ChatComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Start a new thread ");
} }
function ChatComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.currentThread.title || "Untitled thread", " ");
} }
function ChatComponent_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Ask a question to create the first message in a thread. ");
} }
function ChatComponent_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 6);
    i0.ɵɵlistener("click", function ChatComponent_Conditional_34_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.openCurrentThreadInRoute()); });
    i0.ɵɵtext(1, " Open current route ");
    i0.ɵɵelementEnd();
} }
function ChatComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.threadsError);
} }
function ChatComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.threadError);
} }
function ChatComponent_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1, "Loading thread\u2026");
    i0.ɵɵelementEnd();
} }
function ChatComponent_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "h3");
    i0.ɵɵtext(2, "No messages yet");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 3);
    i0.ɵɵtext(4, "Ask a question, and the assistant response will appear here.");
    i0.ɵɵelementEnd()();
} }
function ChatComponent_Conditional_45_For_1_Conditional_8_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const citation_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", citation_r5.manualTitle, " p.", citation_r5.page, " - ", citation_r5.snippet, " ");
} }
function ChatComponent_Conditional_45_For_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29)(1, "strong");
    i0.ɵɵtext(2, "Citations");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul");
    i0.ɵɵrepeaterCreate(4, ChatComponent_Conditional_45_For_1_Conditional_8_For_5_Template, 2, 3, "li", null, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const message_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(message_r6.citations);
} }
function ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const part_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" - ", part_r7.description);
} }
function ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const part_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 ", part_r7.price);
} }
function ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵconditionalCreate(2, ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Conditional_2_Template, 2, 1, "span");
    i0.ɵɵconditionalCreate(3, ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Conditional_3_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const part_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", part_r7.partNumber, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(part_r7.description ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(part_r7.price ? 3 : -1);
} }
function ChatComponent_Conditional_45_For_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29)(1, "strong");
    i0.ɵɵtext(2, "Parts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul");
    i0.ɵɵrepeaterCreate(4, ChatComponent_Conditional_45_For_1_Conditional_9_For_5_Template, 4, 3, "li", null, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const message_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(message_r6.parts);
} }
function ChatComponent_Conditional_45_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 26)(1, "div", 27)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "p", 28);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(8, ChatComponent_Conditional_45_For_1_Conditional_8_Template, 6, 0, "div", 29);
    i0.ɵɵconditionalCreate(9, ChatComponent_Conditional_45_For_1_Conditional_9_Template, 6, 0, "div", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const message_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("user", message_r6.role === "user")("assistant", message_r6.role !== "user");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(message_r6.role);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.formatWhen(message_r6.createdAt));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(message_r6.text);
    i0.ɵɵadvance();
    i0.ɵɵconditional((message_r6.citations == null ? null : message_r6.citations.length) ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((message_r6.parts == null ? null : message_r6.parts.length) ? 9 : -1);
} }
function ChatComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, ChatComponent_Conditional_45_For_1_Template, 10, 9, "article", 25, _forTrack0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r0.messages);
} }
export class ChatComponent {
    constructor() {
        this.api = inject(ApiService);
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.destroyRef = inject(DestroyRef);
        this.threads = [];
        this.messages = [];
        this.currentThreadId = null;
        this.loadingThreads = false;
        this.loadingThread = false;
        this.sending = false;
        this.threadsError = '';
        this.threadError = '';
        this.questionControl = new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2)],
        });
        this.machineIdControl = new FormControl('', { nonNullable: true });
        this.refreshThreads();
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const threadId = params.get('threadId');
            if (threadId) {
                this.loadThread(threadId);
                return;
            }
            this.currentThreadId = null;
            this.messages = [];
            this.loadingThread = false;
            this.threadError = '';
        });
    }
    get currentThread() {
        if (!this.currentThreadId) {
            return undefined;
        }
        return this.threads.find((thread) => thread.id === this.currentThreadId);
    }
    refreshThreads() {
        this.loadingThreads = true;
        this.threadsError = '';
        this.api
            .listThreads()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: ({ threads }) => {
                this.threads = threads ?? [];
                this.loadingThreads = false;
            },
            error: () => {
                this.threadsError = 'Unable to load threads. Check the API connection.';
                this.loadingThreads = false;
            },
        });
    }
    openThread(threadId) {
        void this.router.navigate(['/app/chat', threadId]);
    }
    startNewChat() {
        void this.router.navigate(['/app/chat']);
    }
    openCurrentThreadInRoute() {
        if (!this.currentThreadId) {
            return;
        }
        void this.router.navigate(['/app/chat', this.currentThreadId], { replaceUrl: true });
    }
    loadThread(threadId) {
        this.loadingThread = true;
        this.threadError = '';
        this.currentThreadId = threadId;
        this.api
            .getThread(threadId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: ({ threadId: loadedThreadId, messages }) => {
                this.currentThreadId = loadedThreadId;
                this.messages = messages ?? [];
                this.loadingThread = false;
                this.refreshThreads();
            },
            error: () => {
                this.threadError = 'Unable to load this thread.';
                this.loadingThread = false;
            },
        });
    }
    send() {
        if (this.sending) {
            return;
        }
        const question = this.questionControl.value.trim();
        if (!question) {
            this.questionControl.markAsTouched();
            return;
        }
        this.sending = true;
        this.threadError = '';
        const machineId = this.machineIdControl.value.trim();
        const body = { question };
        if (machineId) {
            body.machineId = machineId;
        }
        if (this.currentThreadId) {
            body.threadId = this.currentThreadId;
        }
        this.api
            .ask(body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: ({ threadId }) => {
                this.questionControl.setValue('');
                const sameThread = this.currentThreadId === threadId;
                if (sameThread) {
                    this.loadThread(threadId);
                    return;
                }
                void this.router.navigate(['/app/chat', threadId], { replaceUrl: true });
            },
            error: () => {
                this.threadError = 'Message failed to send.';
                this.sending = false;
            },
            complete: () => {
                this.sending = false;
            },
        });
    }
    formatWhen(value) {
        if (!value) {
            return '';
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
    }
    static { this.ɵfac = function ChatComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ChatComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ChatComponent, selectors: [["app-chat"]], decls: 59, vars: 17, consts: [[1, "page"], [1, "header"], [1, "eyebrow"], [1, "subtle"], [1, "header-actions"], ["type", "button", 1, "secondary", 3, "click", "disabled"], ["type", "button", 1, "secondary", 3, "click"], [1, "layout"], [1, "panel", "sidebar"], [1, "section-head"], [1, "count"], [1, "error"], [1, "thread-list"], [1, "panel", "chat"], ["type", "button", 1, "secondary"], [1, "thread-meta"], ["type", "text", "placeholder", "Optional machine id", 3, "formControl"], [1, "messages"], [1, "empty-state"], [1, "composer", 3, "ngSubmit"], ["rows", "4", "placeholder", "What\u2019s the likely cause of the leak on line 3?", 3, "formControl"], [1, "composer-actions"], ["type", "submit", 1, "primary", 3, "disabled"], ["type", "button", 1, "thread-item", 3, "active"], ["type", "button", 1, "thread-item", 3, "click"], [1, "message", 3, "user", "assistant"], [1, "message"], [1, "message-head"], [1, "message-text"], [1, "meta-block"]], template: function ChatComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4, "Ask Upkeep");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Threaded chat for manuals and machine context");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, " Load an existing thread or ask a new question. The current conversation stays tied to the same thread id. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 4)(10, "button", 5);
            i0.ɵɵlistener("click", function ChatComponent_Template_button_click_10_listener() { return ctx.refreshThreads(); });
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 6);
            i0.ɵɵlistener("click", function ChatComponent_Template_button_click_12_listener() { return ctx.startNewChat(); });
            i0.ɵɵtext(13, "New chat");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "section", 7)(15, "aside", 8)(16, "div", 9)(17, "h2");
            i0.ɵɵtext(18, "Threads");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "span", 10);
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(21, ChatComponent_Conditional_21_Template, 2, 1, "p", 11);
            i0.ɵɵconditionalCreate(22, ChatComponent_Conditional_22_Template, 2, 0, "p", 3)(23, ChatComponent_Conditional_23_Template, 2, 0, "p", 3)(24, ChatComponent_Conditional_24_Template, 3, 0, "div", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "main", 13)(26, "div", 9)(27, "div")(28, "h2");
            i0.ɵɵconditionalCreate(29, ChatComponent_Conditional_29_Template, 1, 1)(30, ChatComponent_Conditional_30_Template, 1, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "p", 3);
            i0.ɵɵconditionalCreate(32, ChatComponent_Conditional_32_Template, 1, 1)(33, ChatComponent_Conditional_33_Template, 1, 0);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(34, ChatComponent_Conditional_34_Template, 2, 0, "button", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 15)(36, "label")(37, "span");
            i0.ɵɵtext(38, "Machine ID");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(39, "input", 16);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(40, ChatComponent_Conditional_40_Template, 2, 1, "p", 11);
            i0.ɵɵconditionalCreate(41, ChatComponent_Conditional_41_Template, 2, 1, "p", 11);
            i0.ɵɵelementStart(42, "div", 17);
            i0.ɵɵconditionalCreate(43, ChatComponent_Conditional_43_Template, 2, 0, "p", 3)(44, ChatComponent_Conditional_44_Template, 5, 0, "div", 18)(45, ChatComponent_Conditional_45_Template, 2, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "form", 19);
            i0.ɵɵlistener("ngSubmit", function ChatComponent_Template_form_ngSubmit_46_listener() { return ctx.send(); });
            i0.ɵɵelementStart(47, "label")(48, "span");
            i0.ɵɵtext(49, "Question");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(50, "textarea", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "div", 21)(52, "p", 3);
            i0.ɵɵtext(53, " The request is sent to ");
            i0.ɵɵelementStart(54, "code");
            i0.ɵɵtext(55, "/v1/chat/ask");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(56, " and the response is stored in the current thread. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "button", 22);
            i0.ɵɵtext(58);
            i0.ɵɵelementEnd()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("disabled", ctx.loadingThreads);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.loadingThreads ? "Refreshing\u2026" : "Refresh threads", " ");
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.threads.length);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.threadsError ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loadingThreads && ctx.threads.length === 0 ? 22 : ctx.threads.length === 0 ? 23 : 24);
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.currentThreadId ? 29 : 30);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.currentThread ? 32 : 33);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.currentThreadId ? 34 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formControl", ctx.machineIdControl);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.threadsError ? 40 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.threadError ? 41 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loadingThread ? 43 : ctx.messages.length === 0 ? 44 : 45);
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("busy", ctx.sending);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formControl", ctx.questionControl);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("disabled", ctx.sending || ctx.questionControl.invalid);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.sending ? "Sending\u2026" : "Send question", " ");
        } }, dependencies: [CommonModule, ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormControlDirective], styles: [".page[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 20px;\n      }\n\n      .header[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n      }\n\n      .header-actions[_ngcontent-%COMP%] {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n\n      .eyebrow[_ngcontent-%COMP%] {\n        margin: 0 0 6px;\n        font-size: 12px;\n        letter-spacing: 0.12em;\n        text-transform: uppercase;\n        color: #6b7280;\n      }\n\n      h1[_ngcontent-%COMP%], \n   h2[_ngcontent-%COMP%], \n   h3[_ngcontent-%COMP%], \n   p[_ngcontent-%COMP%] {\n        margin: 0;\n      }\n\n      h1[_ngcontent-%COMP%] {\n        font-size: 28px;\n        line-height: 1.15;\n      }\n\n      .subtle[_ngcontent-%COMP%], \n   .count[_ngcontent-%COMP%] {\n        color: #6b7280;\n      }\n\n      .layout[_ngcontent-%COMP%] {\n        display: grid;\n        grid-template-columns: 300px minmax(0, 1fr);\n        gap: 16px;\n        align-items: start;\n      }\n\n      .panel[_ngcontent-%COMP%] {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: #fff;\n        padding: 16px;\n      }\n\n      .sidebar[_ngcontent-%COMP%] {\n        position: sticky;\n        top: 16px;\n      }\n\n      .section-head[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n\n      .thread-list[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 10px;\n      }\n\n      .thread-item[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 4px;\n        text-align: left;\n        padding: 12px;\n        border: 1px solid #e5e7eb;\n        border-radius: 12px;\n        background: #fafafa;\n        color: inherit;\n      }\n\n      .thread-item.active[_ngcontent-%COMP%] {\n        border-color: var(--upkeep-primary);\n        background: #eef4ff;\n      }\n\n      .chat[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 16px;\n      }\n\n      .thread-meta[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n      }\n\n      label[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n      }\n\n      label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n        font-size: 13px;\n        font-weight: 600;\n      }\n\n      input[_ngcontent-%COMP%], \n   textarea[_ngcontent-%COMP%] {\n        width: 100%;\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: #fff;\n      }\n\n      .messages[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n        min-height: 280px;\n        padding: 12px;\n        border: 1px solid #e5e7eb;\n        border-radius: 14px;\n        background: #f8fafc;\n      }\n\n      .empty-state[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n        align-content: center;\n        min-height: 220px;\n        text-align: center;\n      }\n\n      .message[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 8px;\n        padding: 14px;\n        border-radius: 14px;\n        border: 1px solid #dbeafe;\n        background: #eff6ff;\n      }\n\n      .message.user[_ngcontent-%COMP%] {\n        border-color: #fed7aa;\n        background: #fff7ed;\n      }\n\n      .message-head[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        gap: 10px;\n        font-size: 12px;\n        color: #6b7280;\n        text-transform: uppercase;\n        letter-spacing: 0.08em;\n      }\n\n      .message-text[_ngcontent-%COMP%] {\n        white-space: pre-wrap;\n      }\n\n      .meta-block[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 6px;\n        padding-top: 6px;\n        font-size: 14px;\n      }\n\n      .meta-block[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n        margin: 0;\n        padding-left: 18px;\n      }\n\n      .composer[_ngcontent-%COMP%] {\n        display: grid;\n        gap: 12px;\n        padding-top: 4px;\n      }\n\n      .composer-actions[_ngcontent-%COMP%] {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        gap: 12px;\n        flex-wrap: wrap;\n      }\n\n      button[_ngcontent-%COMP%] {\n        border: 0;\n        border-radius: 10px;\n        padding: 10px 14px;\n        font: inherit;\n        cursor: pointer;\n      }\n\n      .primary[_ngcontent-%COMP%], \n   .secondary[_ngcontent-%COMP%] {\n        transition: opacity 120ms ease, transform 120ms ease;\n      }\n\n      .primary[_ngcontent-%COMP%] {\n        background: var(--upkeep-primary);\n        color: white;\n      }\n\n      .secondary[_ngcontent-%COMP%] {\n        background: #eef2ff;\n        color: #3730a3;\n      }\n\n      button[_ngcontent-%COMP%]:disabled {\n        opacity: 0.6;\n        cursor: not-allowed;\n      }\n\n      .busy[_ngcontent-%COMP%] {\n        opacity: 0.95;\n      }\n\n      .error[_ngcontent-%COMP%] {\n        color: #b91c1c;\n      }\n\n      code[_ngcontent-%COMP%] {\n        background: #e5e7eb;\n        padding: 2px 6px;\n        border-radius: 6px;\n      }\n\n      @media (max-width: 900px) {\n        .layout[_ngcontent-%COMP%] {\n          grid-template-columns: 1fr;\n        }\n\n        .sidebar[_ngcontent-%COMP%] {\n          position: static;\n        }\n      }\n\n      @media (max-width: 720px) {\n        .header[_ngcontent-%COMP%] {\n          flex-direction: column;\n        }\n\n        .header-actions[_ngcontent-%COMP%], \n   .composer-actions[_ngcontent-%COMP%] {\n          width: 100%;\n        }\n\n        .header-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n   .composer-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n          width: 100%;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ChatComponent, [{
        type: Component,
        args: [{ selector: 'app-chat', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, ReactiveFormsModule], template: `
    <section class="page">
      <header class="header">
        <div>
          <p class="eyebrow">Ask Upkeep</p>
          <h1>Threaded chat for manuals and machine context</h1>
          <p class="subtle">
            Load an existing thread or ask a new question. The current conversation stays tied to
            the same thread id.
          </p>
        </div>
        <div class="header-actions">
          <button type="button" class="secondary" (click)="refreshThreads()" [disabled]="loadingThreads">
            {{ loadingThreads ? 'Refreshing…' : 'Refresh threads' }}
          </button>
          <button type="button" class="secondary" (click)="startNewChat()">New chat</button>
        </div>
      </header>

      <section class="layout">
        <aside class="panel sidebar">
          <div class="section-head">
            <h2>Threads</h2>
            <span class="count">{{ threads.length }}</span>
          </div>

          @if (threadsError) {
            <p class="error">{{ threadsError }}</p>
          }

          @if (loadingThreads && threads.length === 0) {
            <p class="subtle">Loading threads…</p>
          } @else if (threads.length === 0) {
            <p class="subtle">No saved threads yet.</p>
          } @else {
            <div class="thread-list">
              @for (thread of threads; track thread.id) {
                <button
                  type="button"
                  class="thread-item"
                  [class.active]="thread.id === currentThreadId"
                  (click)="openThread(thread.id)"
                >
                  <strong>{{ thread.title || 'Untitled thread' }}</strong>
                  <span>{{ thread.machineId || 'No machine linked' }}</span>
                  <span>{{ formatWhen(thread.updatedAt) }}</span>
                </button>
              }
            </div>
          }
        </aside>

        <main class="panel chat">
          <div class="section-head">
            <div>
              <h2>
                @if (currentThreadId) {
                  Thread {{ currentThreadId }}
                } @else {
                  Start a new thread
                }
              </h2>
              <p class="subtle">
                @if (currentThread) {
                  {{ currentThread.title || 'Untitled thread' }}
                } @else {
                  Ask a question to create the first message in a thread.
                }
              </p>
            </div>
            @if (currentThreadId) {
              <button type="button" class="secondary" (click)="openCurrentThreadInRoute()">
                Open current route
              </button>
            }
          </div>

          <div class="thread-meta">
            <label>
              <span>Machine ID</span>
              <input
                type="text"
                [formControl]="machineIdControl"
                placeholder="Optional machine id"
              />
            </label>
          </div>

          @if (threadsError) {
            <p class="error">{{ threadsError }}</p>
          }
          @if (threadError) {
            <p class="error">{{ threadError }}</p>
          }

          <div class="messages">
            @if (loadingThread) {
              <p class="subtle">Loading thread…</p>
            } @else if (messages.length === 0) {
              <div class="empty-state">
                <h3>No messages yet</h3>
                <p class="subtle">Ask a question, and the assistant response will appear here.</p>
              </div>
            } @else {
              @for (message of messages; track message.id) {
                <article class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role !== 'user'">
                  <div class="message-head">
                    <strong>{{ message.role }}</strong>
                    <span>{{ formatWhen(message.createdAt) }}</span>
                  </div>
                  <p class="message-text">{{ message.text }}</p>

                  @if (message.citations?.length) {
                    <div class="meta-block">
                      <strong>Citations</strong>
                      <ul>
                        @for (citation of message.citations; track citation.manualId + ':' + citation.page) {
                          <li>
                            {{ citation.manualTitle }} p.{{ citation.page }} - {{ citation.snippet }}
                          </li>
                        }
                      </ul>
                    </div>
                  }

                  @if (message.parts?.length) {
                    <div class="meta-block">
                      <strong>Parts</strong>
                      <ul>
                        @for (part of message.parts; track part.partNumber) {
                          <li>
                            {{ part.partNumber }}
                            @if (part.description) {
                              <span> - {{ part.description }}</span>
                            }
                            @if (part.price) {
                              <span> · {{ part.price }}</span>
                            }
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </article>
              }
            }
          </div>

          <form class="composer" (ngSubmit)="send()" [class.busy]="sending">
            <label>
              <span>Question</span>
              <textarea
                [formControl]="questionControl"
                rows="4"
                placeholder="What’s the likely cause of the leak on line 3?"
              ></textarea>
            </label>

            <div class="composer-actions">
              <p class="subtle">
                The request is sent to <code>/v1/chat/ask</code> and the response is stored in the
                current thread.
              </p>
              <button
                type="submit"
                class="primary"
                [disabled]="sending || questionControl.invalid"
              >
                {{ sending ? 'Sending…' : 'Send question' }}
              </button>
            </div>
          </form>
        </main>
      </section>
    </section>
  `, styles: ["\n      .page {\n        display: grid;\n        gap: 20px;\n      }\n\n      .header {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 16px;\n      }\n\n      .header-actions {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n      }\n\n      .eyebrow {\n        margin: 0 0 6px;\n        font-size: 12px;\n        letter-spacing: 0.12em;\n        text-transform: uppercase;\n        color: #6b7280;\n      }\n\n      h1,\n      h2,\n      h3,\n      p {\n        margin: 0;\n      }\n\n      h1 {\n        font-size: 28px;\n        line-height: 1.15;\n      }\n\n      .subtle,\n      .count {\n        color: #6b7280;\n      }\n\n      .layout {\n        display: grid;\n        grid-template-columns: 300px minmax(0, 1fr);\n        gap: 16px;\n        align-items: start;\n      }\n\n      .panel {\n        border: 1px solid var(--upkeep-border);\n        border-radius: 16px;\n        background: #fff;\n        padding: 16px;\n      }\n\n      .sidebar {\n        position: sticky;\n        top: 16px;\n      }\n\n      .section-head {\n        display: flex;\n        align-items: start;\n        justify-content: space-between;\n        gap: 12px;\n        margin-bottom: 12px;\n      }\n\n      .thread-list {\n        display: grid;\n        gap: 10px;\n      }\n\n      .thread-item {\n        display: grid;\n        gap: 4px;\n        text-align: left;\n        padding: 12px;\n        border: 1px solid #e5e7eb;\n        border-radius: 12px;\n        background: #fafafa;\n        color: inherit;\n      }\n\n      .thread-item.active {\n        border-color: var(--upkeep-primary);\n        background: #eef4ff;\n      }\n\n      .chat {\n        display: grid;\n        gap: 16px;\n      }\n\n      .thread-meta {\n        display: grid;\n        gap: 12px;\n      }\n\n      label {\n        display: grid;\n        gap: 6px;\n      }\n\n      label span {\n        font-size: 13px;\n        font-weight: 600;\n      }\n\n      input,\n      textarea {\n        width: 100%;\n        border: 1px solid var(--upkeep-border);\n        border-radius: 10px;\n        padding: 10px 12px;\n        font: inherit;\n        background: #fff;\n      }\n\n      .messages {\n        display: grid;\n        gap: 12px;\n        min-height: 280px;\n        padding: 12px;\n        border: 1px solid #e5e7eb;\n        border-radius: 14px;\n        background: #f8fafc;\n      }\n\n      .empty-state {\n        display: grid;\n        gap: 6px;\n        align-content: center;\n        min-height: 220px;\n        text-align: center;\n      }\n\n      .message {\n        display: grid;\n        gap: 8px;\n        padding: 14px;\n        border-radius: 14px;\n        border: 1px solid #dbeafe;\n        background: #eff6ff;\n      }\n\n      .message.user {\n        border-color: #fed7aa;\n        background: #fff7ed;\n      }\n\n      .message-head {\n        display: flex;\n        justify-content: space-between;\n        gap: 10px;\n        font-size: 12px;\n        color: #6b7280;\n        text-transform: uppercase;\n        letter-spacing: 0.08em;\n      }\n\n      .message-text {\n        white-space: pre-wrap;\n      }\n\n      .meta-block {\n        display: grid;\n        gap: 6px;\n        padding-top: 6px;\n        font-size: 14px;\n      }\n\n      .meta-block ul {\n        margin: 0;\n        padding-left: 18px;\n      }\n\n      .composer {\n        display: grid;\n        gap: 12px;\n        padding-top: 4px;\n      }\n\n      .composer-actions {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        gap: 12px;\n        flex-wrap: wrap;\n      }\n\n      button {\n        border: 0;\n        border-radius: 10px;\n        padding: 10px 14px;\n        font: inherit;\n        cursor: pointer;\n      }\n\n      .primary,\n      .secondary {\n        transition: opacity 120ms ease, transform 120ms ease;\n      }\n\n      .primary {\n        background: var(--upkeep-primary);\n        color: white;\n      }\n\n      .secondary {\n        background: #eef2ff;\n        color: #3730a3;\n      }\n\n      button:disabled {\n        opacity: 0.6;\n        cursor: not-allowed;\n      }\n\n      .busy {\n        opacity: 0.95;\n      }\n\n      .error {\n        color: #b91c1c;\n      }\n\n      code {\n        background: #e5e7eb;\n        padding: 2px 6px;\n        border-radius: 6px;\n      }\n\n      @media (max-width: 900px) {\n        .layout {\n          grid-template-columns: 1fr;\n        }\n\n        .sidebar {\n          position: static;\n        }\n      }\n\n      @media (max-width: 720px) {\n        .header {\n          flex-direction: column;\n        }\n\n        .header-actions,\n        .composer-actions {\n          width: 100%;\n        }\n\n        .header-actions button,\n        .composer-actions button {\n          width: 100%;\n        }\n      }\n    "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ChatComponent, { className: "ChatComponent", filePath: "src/app/features/chat/chat.component.ts", lineNumber: 454 }); })();
