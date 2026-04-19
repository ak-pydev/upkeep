import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, Manual } from '../../core/services/api.service';

@Component({
  selector: 'app-manuals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
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
        --surface: rgba(255, 255, 255, 0.88);
        --surface-strong: #fff;
        --surface-alt: rgba(243, 227, 208, 0.55);
        --ink: #22313b;
        --muted: #60707d;
        --shadow: 0 18px 40px rgba(69, 87, 101, 0.09);
        background:
          radial-gradient(circle at top left, rgba(170, 205, 220, 0.45), transparent 44%),
          linear-gradient(180deg, rgba(243, 227, 208, 0.6), rgba(129, 166, 198, 0.08));
      }

      .header {
        display: grid;
        gap: 16px;
        padding: 18px;
        border: 1px solid var(--upkeep-border);
        border-radius: 20px;
        background: var(--surface);
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }

      .eyebrow {
        margin: 0 0 6px;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #5a7893;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(30px, 5vw, 42px);
        line-height: 1.05;
        max-width: 12ch;
        color: var(--ink);
      }

      .subtle,
      .meta {
        color: var(--muted);
      }

      .panel {
        display: grid;
        gap: 14px;
        border: 1px solid var(--upkeep-border);
        border-radius: 20px;
        background: var(--surface);
        padding: 18px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .count {
        color: var(--muted);
        font-size: 13px;
      }

      .form-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: 1fr;
      }

      label {
        display: grid;
        gap: 6px;
        color: var(--ink);
      }

      label span {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
      }

      input,
      select {
        width: 100%;
        border: 1px solid var(--upkeep-border);
        border-radius: 12px;
        padding: 11px 12px;
        font: inherit;
        background: rgba(255, 255, 255, 0.92);
        color: var(--ink);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
      }

      .file {
        grid-column: 1 / -1;
      }

      .actions {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 12px;
        gap: 12px;
      }

      button {
        border: 0;
        border-radius: 999px;
        padding: 10px 16px;
        font: inherit;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
      }

      .primary,
      .secondary,
      .danger {
        box-shadow: 0 10px 24px rgba(69, 87, 101, 0.1);
      }

      .primary {
        background: linear-gradient(135deg, var(--upkeep-primary), #6f97b7);
        color: white;
      }

      .secondary {
        background: rgba(170, 205, 220, 0.3);
        color: #335166;
      }

      .danger {
        background: rgba(243, 227, 208, 0.85);
        color: #8b5633;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .manual-list {
        display: grid;
        gap: 12px;
      }

      .manual-card {
        display: grid;
        gap: 16px;
        padding: 14px;
        border: 1px solid rgba(210, 196, 180, 0.85);
        border-radius: 18px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(243, 227, 208, 0.3));
      }

      .manual-main {
        min-width: 0;
        display: grid;
        gap: 6px;
      }

      .manual-title-row {
        display: flex;
        align-items: start;
        gap: 10px;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .manual-title-row h3 {
        font-size: 18px;
        line-height: 1.2;
      }

      .status {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 600;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .status-uploaded {
        background: rgba(129, 166, 198, 0.16);
        color: #35566f;
      }

      .status-parsing {
        background: rgba(243, 227, 208, 0.82);
        color: #8a5b32;
      }

      .status-indexed {
        background: rgba(170, 205, 220, 0.3);
        color: #2f617d;
      }

      .status-failed {
        background: rgba(210, 196, 180, 0.42);
        color: #7d4230;
      }

      .file-name,
      .error {
        margin-top: 10px;
      }

      .error {
        color: #b91c1c;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 8px;
        font-size: 14px;
        margin-top: 4px;
      }

      @media (min-width: 720px) {
        .header {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
        }

        .form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .manual-card {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
        }
      }

      @media (max-width: 720px) {
        .header button,
        .actions button {
          width: 100%;
        }

        .actions {
          width: 100%;
        }

        .section-head {
          align-items: start;
          flex-direction: column;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        button {
          transition: none;
        }
      }
    `,
  ],
})
export class ManualsComponent {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  manuals: Manual[] = [];
  loading = false;
  uploadBusy = false;
  error = '';
  uploadError = '';
  selectedFile: File | null = null;

  readonly titleControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  readonly machineIdControl = new FormControl('', { nonNullable: true });

  readonly sourceControl = new FormControl<'oem' | 'internal'>('oem', {
    nonNullable: true,
  });

  constructor() {
    this.loadManuals();
  }

  loadManuals(): void {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.uploadError = this.selectedFile ? '' : 'Pick a file before uploading.';
  }

  uploadManual(): void {
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
      .uploadManual(
        this.selectedFile,
        this.titleControl.value.trim(),
        machineId,
        this.sourceControl.value
      )
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

  deleteManual(manual: Manual): void {
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

  statusClass(status: Manual['status']): string {
    return `status-${status}`;
  }

  formatWhen(value: string): string {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  }
}
