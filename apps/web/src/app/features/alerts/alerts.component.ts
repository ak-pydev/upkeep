import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { Alert, ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page {
        display: grid;
        gap: 16px;
        padding: 4px;
        --upkeep-primary: #81a6c6;
        --upkeep-border: rgba(210, 196, 180, 0.9);
        --surface: rgba(255, 255, 255, 0.9);
        --ink: #22313b;
        --muted: #60707d;
        --shadow: 0 18px 40px rgba(69, 87, 101, 0.09);
        background:
          radial-gradient(circle at top right, rgba(170, 205, 220, 0.42), transparent 38%),
          linear-gradient(180deg, rgba(243, 227, 208, 0.54), rgba(129, 166, 198, 0.08));
      }

      .hero,
      .panel,
      .stat,
      .alert-card {
        border: 1px solid var(--upkeep-border);
        border-radius: 20px;
        background: var(--surface);
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }

      .hero,
      .panel {
        padding: 18px;
      }

      .hero {
        display: grid;
        gap: 16px;
      }

      .summary,
      .list,
      .alert-card,
      .actions {
        display: grid;
        gap: 12px;
      }

      .summary {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }

      .stat {
        padding: 14px;
        background: linear-gradient(180deg, rgba(243, 227, 208, 0.72), rgba(255, 255, 255, 0.92));
      }

      .label,
      .eyebrow,
      .lede,
      .meta,
      .empty {
        color: var(--muted);
        font-size: 12px;
      }

      h1,
      h2,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(30px, 5vw, 42px);
        line-height: 1.05;
        color: var(--ink);
      }

      .lede {
        margin-top: 6px;
        max-width: 60ch;
        font-size: 14px;
        color: #44545f;
      }

      .panel-head,
      .actions {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        align-items: start;
      }

      .panel-head span {
        color: var(--muted);
        font-size: 13px;
      }

      .alert-card {
        padding: 14px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.93), rgba(243, 227, 208, 0.28));
      }

      .alert-main strong {
        display: block;
        font-size: 17px;
        color: var(--ink);
      }

      .alert-main p {
        margin-top: 4px;
        color: #4f5f6a;
      }

      .meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .meta span {
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(170, 205, 220, 0.18);
        color: #325466;
      }

      .button {
        border: 0;
        border-radius: 999px;
        padding: 10px 16px;
        background: linear-gradient(135deg, var(--upkeep-primary), #6f97b7);
        color: white;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
        box-shadow: 0 10px 24px rgba(69, 87, 101, 0.1);
      }

      .button.secondary {
        background: rgba(170, 205, 220, 0.3);
        color: #335166;
      }

      .actions .button {
        flex: 1 1 140px;
      }

      .error {
        color: #b91c1c;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (min-width: 760px) {
        .hero {
          grid-template-columns: minmax(0, 1fr) minmax(240px, 360px);
          align-items: start;
        }

        .alert-card {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
        }
      }

      @media (max-width: 760px) {
        .hero {
          gap: 14px;
        }

        .panel-head,
        .actions {
          flex-direction: column;
        }

        .actions .button,
        .panel-head button {
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .button {
          transition: none;
        }
      }
    `,
  ],
})
export class AlertsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly workingId = signal<string | null>(null);
  readonly alerts = signal<Alert[]>([]);

  readonly dueSoonCount = signal(0);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .listAlerts()
      .pipe(
        catchError(() => {
          this.error.set('Could not load alerts.');
          return of({ alerts: [] as Alert[] });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((result) => {
        this.alerts.set(result.alerts);
        const now = Date.now();
        const dueSoon = result.alerts.filter((alert) => {
          if (!alert.dueAt) return false;
          const due = new Date(alert.dueAt).getTime();
          return due >= now && due - now <= 3 * 24 * 60 * 60 * 1000;
        });
        this.dueSoonCount.set(dueSoon.length);
      });
  }

  ack(alert: Alert): void {
    this.workingId.set(alert.id);
    this.api
      .ackAlert(alert.id)
      .pipe(finalize(() => this.workingId.set(null)))
      .subscribe({
        next: () => this.load(),
        error: () => this.error.set(`Could not acknowledge ${alert.title}.`),
      });
  }

  dismiss(alert: Alert): void {
    this.workingId.set(alert.id);
    this.api
      .dismissAlert(alert.id)
      .pipe(finalize(() => this.workingId.set(null)))
      .subscribe({
        next: () => this.load(),
        error: () => this.error.set(`Could not dismiss ${alert.title}.`),
      });
  }
}
