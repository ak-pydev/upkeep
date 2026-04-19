import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ApiService, MaintenanceEntry, Machine } from '../../core/services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
          radial-gradient(circle at top left, rgba(170, 205, 220, 0.42), transparent 40%),
          linear-gradient(180deg, rgba(243, 227, 208, 0.54), rgba(129, 166, 198, 0.08));
      }

      .hero,
      .panel,
      .entry {
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

      .toolbar,
      .layout,
      .form,
      .list,
      .entry,
      .meta {
        display: grid;
        gap: 12px;
      }

      .layout {
        grid-template-columns: 1fr;
      }

      .eyebrow,
      .lede,
      .empty,
      .meta,
      .entry-head {
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
      .entry-head {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 12px;
        flex-wrap: wrap;
      }

      .panel-head span {
        color: var(--muted);
        font-size: 13px;
      }

      .entry {
        padding: 14px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.93), rgba(243, 227, 208, 0.28));
        border-left: 4px solid rgba(129, 166, 198, 0.7);
      }

      .issue {
        font-weight: 600;
        color: var(--ink);
      }

      label {
        display: grid;
        gap: 6px;
        color: var(--ink);
      }

      label > * {
        min-width: 0;
      }

      label span {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
      }

      input,
      select,
      textarea {
        border: 1px solid var(--upkeep-border);
        border-radius: 12px;
        padding: 11px 12px;
        font: inherit;
        background: rgba(255, 255, 255, 0.94);
        color: var(--ink);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
      }

      textarea {
        resize: vertical;
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

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .empty.error {
        color: #b91c1c;
      }

      @media (min-width: 960px) {
        .hero {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
          align-items: start;
        }

        .layout {
          grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
          align-items: start;
        }
      }

      @media (min-width: 720px) {
        .toolbar {
          grid-template-columns: minmax(0, 1fr) auto auto;
          align-items: end;
        }

        .layout > .panel:first-child {
          position: sticky;
          top: 16px;
        }
      }

      @media (max-width: 720px) {
        .panel-head,
        .entry-head,
        .toolbar {
          flex-direction: column;
        }

        .toolbar button {
          width: 100%;
        }

        .hero,
        .panel {
          padding: 16px;
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
export class HistoryComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly working = signal(false);
  readonly machines = signal<Machine[]>([]);
  readonly entries = signal<MaintenanceEntry[]>([]);
  query = '';
  draft: Pick<MaintenanceEntry, 'machineId' | 'title' | 'issue' | 'resolution'> = {
    machineId: '',
    title: '',
    issue: '',
    resolution: '',
  };

  ngOnInit(): void {
    this.loadMachines();
    this.load();
  }

  loadMachines(): void {
    this.api.listMachines().pipe(catchError(() => of({ machines: [] as Machine[] }))).subscribe({
      next: (result) => this.machines.set(result.machines),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .listLog()
      .pipe(
        catchError(() => {
          this.error.set('Could not load history.');
          return of({ entries: [] as MaintenanceEntry[] });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((result) => this.entries.set(result.entries));
  }

  search(): void {
    const q = this.query.trim();
    if (!q) {
      this.load();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api
      .searchLog(q)
      .pipe(
        catchError(() => {
          this.error.set('Could not search history.');
          return of({ results: [] as MaintenanceEntry[] });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((result) => this.entries.set(result.results));
  }

  clearSearch(): void {
    this.query = '';
    this.load();
  }

  createEntry(): void {
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

  machineName(machineId: string): string {
    return this.machines().find((machine) => machine.id === machineId)?.name || machineId;
  }
}
