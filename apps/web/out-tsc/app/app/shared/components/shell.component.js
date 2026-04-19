import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/toolbar";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/sidenav";
import * as i5 from "@angular/material/list";
import * as i6 from "@angular/material/menu";
function ShellComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 15)(1, "mat-icon", 8);
    i0.ɵɵtext(2, "settings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 9);
    i0.ɵɵtext(4, "Settings");
    i0.ɵɵelementEnd()();
} }
function ShellComponent_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function ShellComponent_Conditional_42_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); i0.ɵɵnextContext(); const drawer_r3 = i0.ɵɵreference(2); return i0.ɵɵresetView(drawer_r3.toggle()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "menu");
    i0.ɵɵelementEnd()();
} }
export class ShellComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.bp = inject(BreakpointObserver);
        this.isHandset = toSignal(this.bp.observe([Breakpoints.Handset, Breakpoints.XSmall]).pipe(map((r) => r.matches)), { initialValue: false });
    }
    logout() {
        this.auth.logout();
    }
    static { this.ɵfac = function ShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ShellComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ShellComponent, selectors: [["app-shell"]], decls: 59, vars: 7, consts: [["drawer", ""], ["user", "matMenu"], [1, "container"], [1, "sidenav", 3, "mode", "opened"], [1, "brand"], [1, "logo"], [1, "name"], ["mat-list-item", "", "routerLink", "/app/dashboard", "routerLinkActive", "active"], ["matListItemIcon", ""], ["matListItemTitle", ""], ["mat-list-item", "", "routerLink", "/app/chat", "routerLinkActive", "active"], ["mat-list-item", "", "routerLink", "/app/manuals", "routerLinkActive", "active"], ["mat-list-item", "", "routerLink", "/app/tickets", "routerLinkActive", "active"], ["mat-list-item", "", "routerLink", "/app/alerts", "routerLinkActive", "active"], ["mat-list-item", "", "routerLink", "/app/history", "routerLinkActive", "active"], ["mat-list-item", "", "routerLink", "/app/settings", "routerLinkActive", "active"], ["color", "primary", 1, "toolbar"], ["mat-icon-button", "", "aria-label", "Menu"], [1, "spacer"], ["mat-icon-button", "", "aria-label", "Account", 3, "matMenuTriggerFor"], ["mat-menu-item", "", "disabled", ""], ["mat-menu-item", "", 3, "click"], [1, "content"], ["mat-icon-button", "", "aria-label", "Menu", 3, "click"]], template: function ShellComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-sidenav-container", 2)(1, "mat-sidenav", 3, 0)(3, "div", 4)(4, "span", 5);
            i0.ɵɵtext(5, "U");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "span", 6);
            i0.ɵɵtext(7, "Upkeep");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "mat-nav-list")(9, "a", 7)(10, "mat-icon", 8);
            i0.ɵɵtext(11, "dashboard");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "span", 9);
            i0.ɵɵtext(13, "Dashboard");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "a", 10)(15, "mat-icon", 8);
            i0.ɵɵtext(16, "forum");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span", 9);
            i0.ɵɵtext(18, "Ask Upkeep");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "a", 11)(20, "mat-icon", 8);
            i0.ɵɵtext(21, "menu_book");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "span", 9);
            i0.ɵɵtext(23, "Manuals");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "a", 12)(25, "mat-icon", 8);
            i0.ɵɵtext(26, "build");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "span", 9);
            i0.ɵɵtext(28, "Tickets");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(29, "a", 13)(30, "mat-icon", 8);
            i0.ɵɵtext(31, "notifications_active");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "span", 9);
            i0.ɵɵtext(33, "Alerts");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "a", 14)(35, "mat-icon", 8);
            i0.ɵɵtext(36, "history");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "span", 9);
            i0.ɵɵtext(38, "History");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(39, ShellComponent_Conditional_39_Template, 5, 0, "a", 15);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(40, "mat-sidenav-content")(41, "mat-toolbar", 16);
            i0.ɵɵconditionalCreate(42, ShellComponent_Conditional_42_Template, 3, 0, "button", 17);
            i0.ɵɵelement(43, "span", 18);
            i0.ɵɵelementStart(44, "button", 19)(45, "mat-icon");
            i0.ɵɵtext(46, "account_circle");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(47, "mat-menu", null, 1)(49, "button", 20);
            i0.ɵɵtext(50);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "button", 20);
            i0.ɵɵtext(52);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "button", 21);
            i0.ɵɵlistener("click", function ShellComponent_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.logout()); });
            i0.ɵɵelementStart(54, "mat-icon");
            i0.ɵɵtext(55, "logout");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(56, " Sign out ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(57, "main", 22);
            i0.ɵɵelement(58, "router-outlet");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_7_0;
            const user_r4 = i0.ɵɵreference(48);
            i0.ɵɵadvance();
            i0.ɵɵproperty("mode", ctx.isHandset() ? "over" : "side")("opened", !ctx.isHandset());
            i0.ɵɵadvance(38);
            i0.ɵɵconditional(ctx.auth.hasRole("owner") ? 39 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isHandset() ? 42 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("matMenuTriggerFor", user_r4);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(((tmp_7_0 = ctx.auth.user()) == null ? null : tmp_7_0.email) || "\u2014");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("Role: ", ctx.auth.claims().role || "\u2014");
        } }, dependencies: [CommonModule,
            RouterLink,
            RouterLinkActive,
            RouterOutlet,
            MatToolbarModule, i1.MatToolbar, MatButtonModule, i2.MatIconButton, MatIconModule, i3.MatIcon, MatSidenavModule, i4.MatSidenav, i4.MatSidenavContainer, i4.MatSidenavContent, MatListModule, i5.MatNavList, i5.MatListItem, i5.MatListItemIcon, i5.MatListItemTitle, MatMenuModule, i6.MatMenu, i6.MatMenuItem, i6.MatMenuTrigger, MatTooltipModule], styles: [".container[_ngcontent-%COMP%] {\n        height: 100vh;\n      }\n      .sidenav[_ngcontent-%COMP%] {\n        width: 240px;\n        background: #ffffff;\n        border-right: 1px solid var(--upkeep-border);\n      }\n      .brand[_ngcontent-%COMP%] {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        padding: 18px 16px;\n        border-bottom: 1px solid var(--upkeep-border);\n        font-weight: 700;\n        font-size: 18px;\n      }\n      .logo[_ngcontent-%COMP%] {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        width: 28px;\n        height: 28px;\n        border-radius: 6px;\n        background: var(--upkeep-primary);\n        color: white;\n        font-weight: 700;\n      }\n      .toolbar[_ngcontent-%COMP%] {\n        position: sticky;\n        top: 0;\n        z-index: 5;\n      }\n      .spacer[_ngcontent-%COMP%] {\n        flex: 1;\n      }\n      .content[_ngcontent-%COMP%] {\n        padding: 16px;\n        max-width: 1280px;\n        margin: 0 auto;\n      }\n      .active[_ngcontent-%COMP%] {\n        background: #e3f2fd;\n      }\n      @media (min-width: 601px) {\n        .content[_ngcontent-%COMP%] {\n          padding: 24px;\n        }\n      }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ShellComponent, [{
        type: Component,
        args: [{ selector: 'app-shell', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                    CommonModule,
                    RouterLink,
                    RouterLinkActive,
                    RouterOutlet,
                    MatToolbarModule,
                    MatButtonModule,
                    MatIconModule,
                    MatSidenavModule,
                    MatListModule,
                    MatMenuModule,
                    MatTooltipModule,
                ], template: `
    <mat-sidenav-container class="container">
      <mat-sidenav
        #drawer
        class="sidenav"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <div class="brand">
          <span class="logo">U</span>
          <span class="name">Upkeep</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/app/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/app/chat" routerLinkActive="active">
            <mat-icon matListItemIcon>forum</mat-icon>
            <span matListItemTitle>Ask Upkeep</span>
          </a>
          <a mat-list-item routerLink="/app/manuals" routerLinkActive="active">
            <mat-icon matListItemIcon>menu_book</mat-icon>
            <span matListItemTitle>Manuals</span>
          </a>
          <a mat-list-item routerLink="/app/tickets" routerLinkActive="active">
            <mat-icon matListItemIcon>build</mat-icon>
            <span matListItemTitle>Tickets</span>
          </a>
          <a mat-list-item routerLink="/app/alerts" routerLinkActive="active">
            <mat-icon matListItemIcon>notifications_active</mat-icon>
            <span matListItemTitle>Alerts</span>
          </a>
          <a mat-list-item routerLink="/app/history" routerLinkActive="active">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>History</span>
          </a>
          @if (auth.hasRole('owner')) {
            <a mat-list-item routerLink="/app/settings" routerLinkActive="active">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          @if (isHandset()) {
            <button mat-icon-button (click)="drawer.toggle()" aria-label="Menu">
              <mat-icon>menu</mat-icon>
            </button>
          }
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="user" aria-label="Account">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #user="matMenu">
            <button mat-menu-item disabled>{{ auth.user()?.email || '—' }}</button>
            <button mat-menu-item disabled>Role: {{ auth.claims().role || '—' }}</button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Sign out
            </button>
          </mat-menu>
        </mat-toolbar>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `, styles: ["\n      .container {\n        height: 100vh;\n      }\n      .sidenav {\n        width: 240px;\n        background: #ffffff;\n        border-right: 1px solid var(--upkeep-border);\n      }\n      .brand {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        padding: 18px 16px;\n        border-bottom: 1px solid var(--upkeep-border);\n        font-weight: 700;\n        font-size: 18px;\n      }\n      .logo {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        width: 28px;\n        height: 28px;\n        border-radius: 6px;\n        background: var(--upkeep-primary);\n        color: white;\n        font-weight: 700;\n      }\n      .toolbar {\n        position: sticky;\n        top: 0;\n        z-index: 5;\n      }\n      .spacer {\n        flex: 1;\n      }\n      .content {\n        padding: 16px;\n        max-width: 1280px;\n        margin: 0 auto;\n      }\n      .active {\n        background: #e3f2fd;\n      }\n      @media (min-width: 601px) {\n        .content {\n          padding: 24px;\n        }\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/shared/components/shell.component.ts", lineNumber: 159 }); })();
