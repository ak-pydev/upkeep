import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

export type Role = 'owner' | 'supervisor' | 'technician';

export interface OrgClaims {
  orgId?: string;
  role?: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  /** the raw firebase user (null while unauth'd) */
  readonly user = toSignal<User | null>(authState(this.auth), { initialValue: null });

  /** custom-claims snapshot — refreshed every time the ID token refreshes */
  private readonly _claims = signal<OrgClaims>({});
  readonly claims = this._claims.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly hasOrg = computed(() => !!this._claims().orgId);

  constructor() {
    // keep claims fresh
    authState(this.auth).subscribe(async (u) => {
      if (!u) {
        this._claims.set({});
        return;
      }
      const tok = await u.getIdTokenResult(/* forceRefresh */ false);
      this._claims.set({
        orgId: (tok.claims as Record<string, unknown>)['orgId'] as string | undefined,
        role: (tok.claims as Record<string, unknown>)['role'] as Role | undefined,
      });
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async idToken(forceRefresh = false): Promise<string | null> {
    const u = this.auth.currentUser;
    if (!u) return null;
    return u.getIdToken(forceRefresh);
  }

  async refreshClaims(): Promise<void> {
    const u = this.auth.currentUser;
    if (!u) return;
    const tok = await u.getIdTokenResult(true);
    this._claims.set({
      orgId: (tok.claims as Record<string, unknown>)['orgId'] as string | undefined,
      role: (tok.claims as Record<string, unknown>)['role'] as Role | undefined,
    });
  }

  hasRole(...allowed: Role[]): boolean {
    const r = this._claims().role;
    return !!r && allowed.includes(r);
  }
}
