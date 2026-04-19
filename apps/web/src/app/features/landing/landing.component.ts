import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">U</span>
          <div>
            <strong>Upkeep</strong>
            <span>Premium maintenance intelligence</span>
          </div>
        </div>
        <div class="topbar-chip">
          <mat-icon>precision_manufacturing</mat-icon>
          <span>Soft industrial workflow</span>
        </div>
      </header>

      <section class="hero">
        <div class="copy">
          <span class="eyebrow">Industrial AI support</span>
          <h1>Find the fix, cite the manual, log the repair.</h1>
          <p class="lede">
            Upkeep helps machine shops upload manuals, ask grounded questions, surface likely parts,
            and keep a searchable maintenance history for the next downtime event.
          </p>

          <div class="stats">
            <article>
              <strong>Grounded answers</strong>
              <span>Manual snippets and part links stay attached to the work.</span>
            </article>
            <article>
              <strong>Fast handoff</strong>
              <span>Move from diagnosis to repair log without leaving the flow.</span>
            </article>
            <article>
              <strong>Built for teams</strong>
              <span>Organization-aware access keeps every machine context aligned.</span>
            </article>
          </div>

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
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        color: #243447;
        background:
          radial-gradient(circle at top left, rgba(129, 166, 198, 0.38), transparent 30%),
          radial-gradient(circle at top right, rgba(243, 227, 208, 0.8), transparent 24%),
          linear-gradient(180deg, #f8f4ec 0%, #eef3f6 100%);
      }

      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 20px;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
        padding: 14px 16px;
        border: 1px solid rgba(130, 153, 171, 0.18);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 18px 40px rgba(83, 98, 109, 0.08);
        backdrop-filter: blur(14px);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        display: inline-grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(145deg, #81a6c6, #aacddc);
        color: #102033;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      .brand strong,
      .brand span,
      .topbar-chip span {
        display: block;
      }

      .brand strong {
        font-size: 1rem;
      }

      .brand span,
      .topbar-chip span {
        color: #617789;
        font-size: 0.92rem;
      }

      .topbar-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 999px;
        background: rgba(243, 227, 208, 0.72);
        color: #6f5d47;
        white-space: nowrap;
      }

      .topbar-chip mat-icon {
        width: 18px;
        height: 18px;
        font-size: 18px;
      }

      .hero {
        display: grid;
        gap: 18px;
      }

      .copy {
        padding: 10px 2px 2px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        color: #55748d;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        max-width: 11ch;
        font-size: clamp(2.6rem, 11vw, 5.4rem);
        line-height: 0.95;
        letter-spacing: -0.05em;
        color: #1e2c3a;
      }

      .lede {
        margin: 18px 0 0;
        max-width: 60ch;
        font-size: 1.05rem;
        line-height: 1.7;
        color: #556676;
      }

      .stats {
        display: grid;
        gap: 12px;
        margin-top: 22px;
      }

      .stats article {
        padding: 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(130, 153, 171, 0.14);
        box-shadow: 0 10px 24px rgba(83, 98, 109, 0.06);
      }

      .stats strong {
        display: block;
        margin-bottom: 4px;
        color: #243447;
      }

      .stats span,
      .upkeep-muted {
        color: #617789;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      .actions a {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding-inline: 18px;
      }

      .panel {
        position: relative;
        overflow: hidden;
        padding: 22px;
        border-radius: 28px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.76)),
          linear-gradient(145deg, rgba(170, 205, 220, 0.18), rgba(243, 227, 208, 0.18));
        border: 1px solid rgba(129, 166, 198, 0.18);
        box-shadow: 0 28px 80px rgba(83, 98, 109, 0.14);
      }

      .panel::before {
        content: '';
        position: absolute;
        inset: auto -10% -30% auto;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(170, 205, 220, 0.36), transparent 72%);
        pointer-events: none;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
      }

      .upkeep-pill {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(243, 227, 208, 0.9);
        color: #6d5a42;
        font-size: 0.78rem;
        font-weight: 700;
      }

      h2 {
        margin: 0 0 12px;
        font-size: clamp(1.45rem, 4vw, 2rem);
        color: #1e2c3a;
      }

      ul {
        margin: 16px 0 0;
        padding-left: 18px;
        color: #405160;
      }

      li + li {
        margin-top: 10px;
      }

      @media (min-width: 900px) {
        .shell {
          padding: 28px 32px 40px;
        }

        .hero {
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          align-items: center;
          gap: 28px;
          min-height: calc(100vh - 132px);
        }

        .stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .panel {
          padding: 28px;
        }
      }
    `,
  ],
})
export class LandingComponent {
  private readonly auth = inject(AuthService);
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
}
