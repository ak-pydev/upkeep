import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, ChatMessage, Thread } from '../../core/services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
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
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 20px;
      }

      .header {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
      }

      .header-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .eyebrow {
        margin: 0 0 6px;
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #6b7280;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: 28px;
        line-height: 1.15;
      }

      .subtle,
      .count {
        color: #6b7280;
      }

      .layout {
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }

      .panel {
        border: 1px solid var(--upkeep-border);
        border-radius: 16px;
        background: #fff;
        padding: 16px;
      }

      .sidebar {
        position: sticky;
        top: 16px;
      }

      .section-head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .thread-list {
        display: grid;
        gap: 10px;
      }

      .thread-item {
        display: grid;
        gap: 4px;
        text-align: left;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fafafa;
        color: inherit;
      }

      .thread-item.active {
        border-color: var(--upkeep-primary);
        background: #eef4ff;
      }

      .chat {
        display: grid;
        gap: 16px;
      }

      .thread-meta {
        display: grid;
        gap: 12px;
      }

      label {
        display: grid;
        gap: 6px;
      }

      label span {
        font-size: 13px;
        font-weight: 600;
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid var(--upkeep-border);
        border-radius: 10px;
        padding: 10px 12px;
        font: inherit;
        background: #fff;
      }

      .messages {
        display: grid;
        gap: 12px;
        min-height: 280px;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #f8fafc;
      }

      .empty-state {
        display: grid;
        gap: 6px;
        align-content: center;
        min-height: 220px;
        text-align: center;
      }

      .message {
        display: grid;
        gap: 8px;
        padding: 14px;
        border-radius: 14px;
        border: 1px solid #dbeafe;
        background: #eff6ff;
      }

      .message.user {
        border-color: #fed7aa;
        background: #fff7ed;
      }

      .message-head {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .message-text {
        white-space: pre-wrap;
      }

      .meta-block {
        display: grid;
        gap: 6px;
        padding-top: 6px;
        font-size: 14px;
      }

      .meta-block ul {
        margin: 0;
        padding-left: 18px;
      }

      .composer {
        display: grid;
        gap: 12px;
        padding-top: 4px;
      }

      .composer-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      button {
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        font: inherit;
        cursor: pointer;
      }

      .primary,
      .secondary {
        transition: opacity 120ms ease, transform 120ms ease;
      }

      .primary {
        background: var(--upkeep-primary);
        color: white;
      }

      .secondary {
        background: #eef2ff;
        color: #3730a3;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .busy {
        opacity: 0.95;
      }

      .error {
        color: #b91c1c;
      }

      code {
        background: #e5e7eb;
        padding: 2px 6px;
        border-radius: 6px;
      }

      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: static;
        }
      }

      @media (max-width: 720px) {
        .header {
          flex-direction: column;
        }

        .header-actions,
        .composer-actions {
          width: 100%;
        }

        .header-actions button,
        .composer-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ChatComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  threads: Thread[] = [];
  messages: ChatMessage[] = [];
  currentThreadId: string | null = null;
  loadingThreads = false;
  loadingThread = false;
  sending = false;
  threadsError = '';
  threadError = '';

  readonly questionControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  readonly machineIdControl = new FormControl('', { nonNullable: true });

  constructor() {
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

  get currentThread(): Thread | undefined {
    if (!this.currentThreadId) {
      return undefined;
    }

    return this.threads.find((thread) => thread.id === this.currentThreadId);
  }

  refreshThreads(): void {
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

  openThread(threadId: string): void {
    void this.router.navigate(['/app/chat', threadId]);
  }

  startNewChat(): void {
    void this.router.navigate(['/app/chat']);
  }

  openCurrentThreadInRoute(): void {
    if (!this.currentThreadId) {
      return;
    }

    void this.router.navigate(['/app/chat', this.currentThreadId], { replaceUrl: true });
  }

  loadThread(threadId: string): void {
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

  send(): void {
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
    const body: {
      question: string;
      machineId?: string;
      threadId?: string;
    } = { question };

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

  formatWhen(value?: string): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  }
}
