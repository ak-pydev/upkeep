import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin, of, finalize, catchError } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import {
  Alert,
  ApiService,
  MaintenanceEntry,
  Machine,
  Manual,
  Ticket,
  Thread,
} from '../../core/services/api.service';

type DashboardState = {
  machines: Machine[];
  manuals: Manual[];
  tickets: Ticket[];
  alerts: Alert[];
  history: MaintenanceEntry[];
  threads: Thread[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Operations overview</p>
          <h1>Dashboard</h1>
          <p class="lede">
            Summary of machines, manuals, tickets, alerts, and recent maintenance activity.
          </p>
          <div class="hero-pills">
            <span class="pill">Machines {{ summary().machines }}</span>
            <span class="pill">Open tickets {{ summary().openTickets }}</span>
            <span class="pill">Active alerts {{ summary().activeAlerts }}</span>
          </div>
        </div>

        <div class="hero-card">
          <span class="card-kicker">Workspace status</span>
          <strong class="card-title">{{ auth.user()?.email || 'Signed in' }}</strong>
          <p class="card-copy">Role: {{ auth.claims().role || 'unassigned' }}</p>
          <div class="card-grid">
            <div class="card-stat">
              <span class="label">Manuals indexed</span>
              <strong>{{ summary().indexedManuals }}</strong>
            </div>
            <div class="card-stat">
              <span class="label">Fix logs</span>
              <strong>{{ summary().historyEntries }}</strong>
            </div>
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
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 18px;
      }

      .hero,
      .panel,
      .stat-card {
        border: 1px solid rgba(129, 166, 198, 0.2);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 18px 50px rgba(82, 110, 130, 0.08);
      }

      .hero {
        display: grid;
        gap: 16px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(129, 166, 198, 0.22) 0%, rgba(170, 205, 220, 0.26) 42%, rgba(243, 227, 208, 0.74) 100%);
      }

      .hero-copy {
        display: grid;
        gap: 12px;
      }

      .eyebrow,
      .label,
      .item-meta,
      .empty {
        color: #63727d;
        font-size: 12px;
      }

      h1,
      h2,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(30px, 5vw, 56px);
        line-height: 0.95;
        letter-spacing: -0.05em;
      }

      .lede {
        max-width: 60ch;
        color: #41515d;
        font-size: 16px;
        line-height: 1.65;
      }

      .hero-pills,
      .card-grid,
      .stats,
      .grid {
        display: grid;
      }

      .hero-pills {
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(140px, max-content));
      }

      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(129, 166, 198, 0.22);
        color: #35556b;
        font-weight: 600;
        font-size: 12px;
      }

      .hero-card,
      .stat-card {
        padding: 16px;
        display: grid;
        gap: 10px;
      }

      .hero-card {
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.72);
      }

      .card-kicker {
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #5d7282;
      }

      .card-title {
        font-size: 22px;
        line-height: 1.2;
        letter-spacing: -0.03em;
      }

      .card-copy {
        color: #41515d;
      }

      .card-grid {
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .card-stat {
        padding: 14px;
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(243, 227, 208, 0.5), rgba(255, 255, 255, 0.9));
        border: 1px solid rgba(210, 196, 180, 0.65);
      }

      .stats {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .stat-card {
        gap: 8px;
        min-height: 112px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(250, 246, 241, 0.86));
      }

      .stat-card strong {
        font-size: 30px;
        letter-spacing: -0.05em;
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .panel {
        padding: 18px;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }

      .list {
        display: grid;
        gap: 12px;
      }

      .item {
        padding: 14px;
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(243, 227, 208, 0.28), rgba(255, 255, 255, 0.88));
        border: 1px solid rgba(210, 196, 180, 0.58);
        display: grid;
        gap: 8px;
      }

      .item-main {
        display: grid;
        gap: 4px;
      }

      .item-meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .item-meta span {
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(129, 166, 198, 0.12);
        color: #456176;
      }

      .panel.error {
        display: grid;
        gap: 12px;
      }

      .button {
        justify-self: start;
        border: 0;
        border-radius: 999px;
        padding: 10px 14px;
        background: linear-gradient(135deg, #81a6c6 0%, #6f97b6 100%);
        color: #17324a;
        font-weight: 700;
        cursor: pointer;
      }

      .empty {
        padding: 8px 0;
      }

      @media (min-width: 900px) {
        .hero {
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
          align-items: start;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly state = signal<DashboardState>({
    machines: [],
    manuals: [],
    tickets: [],
    alerts: [],
    history: [],
    threads: [],
  });

  readonly machines = computed(() => this.state().machines);
  readonly manuals = computed(() => this.state().manuals);
  readonly tickets = computed(() => this.state().tickets);
  readonly alerts = computed(() => this.state().alerts);
  readonly history = computed(() => this.state().history);
  readonly threads = computed(() => this.state().threads);

  readonly summary = computed(() => {
    const state = this.state();
    return {
      machines: state.machines.length,
      indexedManuals: state.manuals.filter((manual) => manual.status === 'indexed').length,
      openTickets: state.tickets.filter((ticket) => ticket.status !== 'closed').length,
      activeAlerts: state.alerts.filter((alert) => !['dismissed', 'acked'].includes(alert.status)).length,
      historyEntries: state.history.length,
      threads: state.threads.length,
    };
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      machines: this.api.listMachines().pipe(catchError(() => of({ machines: [] as Machine[] }))),
      manuals: this.api.listManuals().pipe(catchError(() => of({ manuals: [] as Manual[] }))),
      tickets: this.api.listTickets().pipe(catchError(() => of({ tickets: [] as Ticket[] }))),
      alerts: this.api.listAlerts().pipe(catchError(() => of({ alerts: [] as Alert[] }))),
      history: this.api.listLog().pipe(catchError(() => of({ entries: [] as MaintenanceEntry[] }))),
      threads: this.api.listThreads().pipe(catchError(() => of({ threads: [] as Thread[] }))),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) =>
          this.state.set({
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
}
