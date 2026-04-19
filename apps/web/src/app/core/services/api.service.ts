import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Machine {
  id: string;
  name: string;
  make: string;
  model: string;
  serialNumber?: string;
  hoursRun?: number;
  nextServiceHours?: number;
}

export interface Manual {
  id: string;
  title: string;
  status: 'uploaded' | 'parsing' | 'indexed' | 'failed';
  machineId?: string;
  source: 'oem' | 'internal';
  pageCount?: number;
  chunkCount?: number;
  error?: string;
  uploadedAt?: string;
}

export interface Citation {
  manualId: string;
  manualTitle: string;
  page: number;
  snippet: string;
}

export interface PartRef {
  partNumber: string;
  description?: string;
  mcmasterUrl?: string;
  graingerUrl?: string;
  price?: string;
  inStock?: boolean;
  leadTime?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  citations?: Citation[];
  parts?: PartRef[];
  imageUrls?: string[];
  createdAt?: string;
}

export interface Thread {
  id: string;
  title: string;
  machineId?: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  machineId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'awaiting_parts' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  assigneeUid?: string;
  threadId?: string;
  mttrMinutes?: number;
  createdAt?: string;
}

export interface MaintenanceEntry {
  id: string;
  machineId: string;
  title: string;
  issue: string;
  resolution: string;
  technicianUid: string;
  occurredAt?: string;
}

export interface Alert {
  id: string;
  machineId: string;
  machineName?: string;
  kind: string;
  title: string;
  detail: string;
  status: string;
  dueAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  // --- orgs ---
  createOrg(name: string): Observable<{ orgId: string }> {
    return this.http.post<{ orgId: string }>(`${this.base}/v1/orgs`, { name });
  }
  me(): Observable<{ orgId?: string; role?: string; needsOrg?: boolean; name?: string }> {
    return this.http.get<{ orgId?: string; role?: string; needsOrg?: boolean; name?: string }>(
      `${this.base}/v1/orgs/me`
    );
  }

  // --- machines ---
  listMachines(): Observable<{ machines: Machine[] }> {
    return this.http.get<{ machines: Machine[] }>(`${this.base}/v1/machines`);
  }
  createMachine(m: Partial<Machine>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/v1/machines`, m);
  }

  // --- manuals ---
  listManuals(): Observable<{ manuals: Manual[] }> {
    return this.http.get<{ manuals: Manual[] }>(`${this.base}/v1/manuals`);
  }
  uploadManual(file: File, title: string, machineId?: string, source: 'oem' | 'internal' = 'oem') {
    const fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('title', title);
    if (machineId) fd.append('machineId', machineId);
    fd.append('source', source);
    return this.http.post<{ id: string; pageCount: number; chunkCount: number; status: string }>(
      `${this.base}/v1/manuals`,
      fd
    );
  }
  deleteManual(id: string) {
    return this.http.delete<{ ok: boolean }>(`${this.base}/v1/manuals/${id}`);
  }

  // --- chat ---
  ask(body: {
    question: string;
    machineId?: string;
    threadId?: string;
    imageUrls?: string[];
  }): Observable<{ threadId: string; message: ChatMessage }> {
    return this.http.post<{ threadId: string; message: ChatMessage }>(
      `${this.base}/v1/chat/ask`,
      body
    );
  }
  listThreads(): Observable<{ threads: Thread[] }> {
    return this.http.get<{ threads: Thread[] }>(`${this.base}/v1/chat/threads`);
  }
  getThread(id: string): Observable<{ threadId: string; messages: ChatMessage[] }> {
    return this.http.get<{ threadId: string; messages: ChatMessage[] }>(
      `${this.base}/v1/chat/threads/${id}`
    );
  }

  // --- tickets ---
  listTickets(params?: { status?: string; machineId?: string }): Observable<{ tickets: Ticket[] }> {
    let p = new HttpParams();
    if (params?.status) p = p.set('status', params.status);
    if (params?.machineId) p = p.set('machineId', params.machineId);
    return this.http.get<{ tickets: Ticket[] }>(`${this.base}/v1/tickets`, { params: p });
  }
  createTicket(t: Partial<Ticket>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/v1/tickets`, t);
  }
  updateTicket(id: string, patch: Partial<Ticket>) {
    return this.http.patch<{ ok: boolean }>(`${this.base}/v1/tickets/${id}`, patch);
  }
  closeTicket(id: string, body: { resolution: string; logToHistory: boolean; parts?: PartRef[] }) {
    return this.http.post<{ ok: boolean }>(`${this.base}/v1/tickets/${id}/close`, body);
  }

  // --- maintenance log ---
  listLog(machineId?: string): Observable<{ entries: MaintenanceEntry[] }> {
    let p = new HttpParams();
    if (machineId) p = p.set('machineId', machineId);
    return this.http.get<{ entries: MaintenanceEntry[] }>(`${this.base}/v1/maintenance-log`, { params: p });
  }
  createLog(body: Partial<MaintenanceEntry>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/v1/maintenance-log`, body);
  }
  searchLog(q: string): Observable<{ results: MaintenanceEntry[] }> {
    return this.http.get<{ results: MaintenanceEntry[] }>(
      `${this.base}/v1/maintenance-log/search?q=${encodeURIComponent(q)}`
    );
  }

  // --- alerts ---
  listAlerts(): Observable<{ alerts: Alert[] }> {
    return this.http.get<{ alerts: Alert[] }>(`${this.base}/v1/alerts`);
  }
  ackAlert(id: string) {
    return this.http.post<{ ok: boolean }>(`${this.base}/v1/alerts/${id}/ack`, {});
  }
  dismissAlert(id: string) {
    return this.http.post<{ ok: boolean }>(`${this.base}/v1/alerts/${id}/dismiss`, {});
  }

  // --- parts ---
  lookupParts(q: string): Observable<{ parts: PartRef[] }> {
    return this.http.get<{ parts: PartRef[] }>(
      `${this.base}/v1/parts/lookup?q=${encodeURIComponent(q)}`
    );
  }

  // --- analytics ---
  mttr(): Observable<any> { return this.http.get(`${this.base}/v1/analytics/mttr`); }
  downtime(): Observable<any> { return this.http.get(`${this.base}/v1/analytics/downtime`); }
}
