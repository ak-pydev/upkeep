import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ApiService, Machine, Ticket } from '../../core/services/api.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
        --surface-alt: rgba(243, 227, 208, 0.45);
        --ink: #22313b;
        --muted: #60707d;
        --shadow: 0 18px 40px rgba(69, 87, 101, 0.09);
        background:
          radial-gradient(circle at top right, rgba(170, 205, 220, 0.42), transparent 38%),
          linear-gradient(180deg, rgba(243, 227, 208, 0.54), rgba(129, 166, 198, 0.08));
      }

      .hero,
      .panel,
      .ticket {
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

      .filters,
      .layout,
      .list,
      .form,
      .ticket,
      .actions {
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
      .status {
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
      .ticket-head,
      .actions {
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

      .ticket {
        padding: 14px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(243, 227, 208, 0.28));
      }

      .ticket-head strong {
        display: block;
        font-size: 17px;
        color: var(--ink);
      }

      .ticket-head p {
        margin-top: 4px;
        color: #4f5f6a;
      }

      .meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        font-size: 12px;
      }

      .meta span {
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(170, 205, 220, 0.18);
        color: #325466;
      }

      label {
        display: grid;
        gap: 6px;
        font-size: 13px;
        color: var(--ink);
      }

      label > * {
        min-width: 0;
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

      .status {
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(243, 227, 208, 0.8);
        color: #8a5b32;
      }

      .resolution {
        margin-top: 4px;
      }

      .resolution textarea {
        min-height: 84px;
      }

      .empty.error {
        color: #b91c1c;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (min-width: 900px) {
        .hero {
          grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
          align-items: start;
        }

        .layout {
          grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
          align-items: start;
        }
      }

      @media (min-width: 720px) {
        .filters {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: end;
        }

        .actions {
          align-items: stretch;
        }

        .actions .button {
          flex: 1 1 150px;
        }

        .layout > .panel:first-child {
          position: sticky;
          top: 16px;
        }
      }

      @media (max-width: 720px) {
        .panel-head,
        .ticket-head,
        .actions {
          flex-direction: column;
        }

        .actions .button,
        .filters button {
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
export class TicketsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly working = signal(false);
  readonly machines = signal<Machine[]>([]);
  readonly tickets = signal<Ticket[]>([]);
  statusFilter = '';
  machineFilter = '';
  draft: Pick<Ticket, 'machineId' | 'title' | 'description' | 'priority'> = {
    machineId: '',
    title: '',
    description: '',
    priority: 'normal',
  };
  readonly closeNotes: Record<string, string> = {};

  ngOnInit(): void {
    this.load();
    this.loadMachines();
  }

  loadMachines(): void {
    this.api.listMachines().pipe(catchError(() => of({ machines: [] as Machine[] }))).subscribe({
      next: (result) => this.machines.set(result.machines),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const params = {
      status: this.statusFilter || undefined,
      machineId: this.machineFilter || undefined,
    };

    this.api
      .listTickets(params)
      .pipe(
        catchError(() => {
          this.error.set('Could not load tickets.');
          return of({ tickets: [] as Ticket[] });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((result) => {
        this.tickets.set(result.tickets);
        for (const ticket of result.tickets) {
          if (!this.closeNotes[ticket.id]) {
            this.closeNotes[ticket.id] = ticket.description;
          }
        }
      });
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.machineFilter = '';
    this.load();
  }

  createTicket(): void {
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

  updateStatus(ticket: Ticket, status: Ticket['status']): void {
    this.working.set(true);
    this.api
      .updateTicket(ticket.id, { status })
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: () => this.load(),
        error: () => this.error.set(`Could not update ${ticket.title}.`),
      });
  }

  closeTicket(ticket: Ticket): void {
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
}
