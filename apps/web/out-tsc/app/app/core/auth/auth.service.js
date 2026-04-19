import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import * as i0 from "@angular/core";
export class AuthService {
    constructor() {
        this.auth = inject(Auth);
        /** the raw firebase user (null while unauth'd) */
        this.user = toSignal(authState(this.auth), { initialValue: null });
        /** custom-claims snapshot — refreshed every time the ID token refreshes */
        this._claims = signal({}, ...(ngDevMode ? [{ debugName: "_claims" }] : []));
        this.claims = this._claims.asReadonly();
        this.isAuthenticated = computed(() => this.user() !== null, ...(ngDevMode ? [{ debugName: "isAuthenticated" }] : []));
        this.hasOrg = computed(() => !!this._claims().orgId, ...(ngDevMode ? [{ debugName: "hasOrg" }] : []));
        // keep claims fresh
        authState(this.auth).subscribe(async (u) => {
            if (!u) {
                this._claims.set({});
                return;
            }
            const tok = await u.getIdTokenResult(/* forceRefresh */ false);
            this._claims.set({
                orgId: tok.claims['orgId'],
                role: tok.claims['role'],
            });
        });
    }
    async loginWithEmail(email, password) {
        await signInWithEmailAndPassword(this.auth, email, password);
    }
    async registerWithEmail(email, password) {
        await createUserWithEmailAndPassword(this.auth, email, password);
    }
    async loginWithGoogle() {
        await signInWithPopup(this.auth, new GoogleAuthProvider());
    }
    async logout() {
        await signOut(this.auth);
    }
    async idToken(forceRefresh = false) {
        const u = this.auth.currentUser;
        if (!u)
            return null;
        return u.getIdToken(forceRefresh);
    }
    async refreshClaims() {
        const u = this.auth.currentUser;
        if (!u)
            return;
        const tok = await u.getIdTokenResult(true);
        this._claims.set({
            orgId: tok.claims['orgId'],
            role: tok.claims['role'],
        });
    }
    hasRole(...allowed) {
        const r = this._claims().role;
        return !!r && allowed.includes(r);
    }
    static { this.ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
