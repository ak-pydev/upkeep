import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
export class ApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.base = environment.apiBaseUrl;
    }
    // --- orgs ---
    createOrg(name) {
        return this.http.post(`${this.base}/v1/orgs`, { name });
    }
    me() {
        return this.http.get(`${this.base}/v1/orgs/me`);
    }
    // --- machines ---
    listMachines() {
        return this.http.get(`${this.base}/v1/machines`);
    }
    createMachine(m) {
        return this.http.post(`${this.base}/v1/machines`, m);
    }
    // --- manuals ---
    listManuals() {
        return this.http.get(`${this.base}/v1/manuals`);
    }
    uploadManual(file, title, machineId, source = 'oem') {
        const fd = new FormData();
        fd.append('file', file, file.name);
        fd.append('title', title);
        if (machineId)
            fd.append('machineId', machineId);
        fd.append('source', source);
        return this.http.post(`${this.base}/v1/manuals`, fd);
    }
    deleteManual(id) {
        return this.http.delete(`${this.base}/v1/manuals/${id}`);
    }
    // --- chat ---
    ask(body) {
        return this.http.post(`${this.base}/v1/chat/ask`, body);
    }
    listThreads() {
        return this.http.get(`${this.base}/v1/chat/threads`);
    }
    getThread(id) {
        return this.http.get(`${this.base}/v1/chat/threads/${id}`);
    }
    // --- tickets ---
    listTickets(params) {
        let p = new HttpParams();
        if (params?.status)
            p = p.set('status', params.status);
        if (params?.machineId)
            p = p.set('machineId', params.machineId);
        return this.http.get(`${this.base}/v1/tickets`, { params: p });
    }
    createTicket(t) {
        return this.http.post(`${this.base}/v1/tickets`, t);
    }
    updateTicket(id, patch) {
        return this.http.patch(`${this.base}/v1/tickets/${id}`, patch);
    }
    closeTicket(id, body) {
        return this.http.post(`${this.base}/v1/tickets/${id}/close`, body);
    }
    // --- maintenance log ---
    listLog(machineId) {
        let p = new HttpParams();
        if (machineId)
            p = p.set('machineId', machineId);
        return this.http.get(`${this.base}/v1/maintenance-log`, { params: p });
    }
    createLog(body) {
        return this.http.post(`${this.base}/v1/maintenance-log`, body);
    }
    searchLog(q) {
        return this.http.get(`${this.base}/v1/maintenance-log/search?q=${encodeURIComponent(q)}`);
    }
    // --- alerts ---
    listAlerts() {
        return this.http.get(`${this.base}/v1/alerts`);
    }
    ackAlert(id) {
        return this.http.post(`${this.base}/v1/alerts/${id}/ack`, {});
    }
    dismissAlert(id) {
        return this.http.post(`${this.base}/v1/alerts/${id}/dismiss`, {});
    }
    // --- parts ---
    lookupParts(q) {
        return this.http.get(`${this.base}/v1/parts/lookup?q=${encodeURIComponent(q)}`);
    }
    // --- analytics ---
    mttr() { return this.http.get(`${this.base}/v1/analytics/mttr`); }
    downtime() { return this.http.get(`${this.base}/v1/analytics/downtime`); }
    static { this.ɵfac = function ApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
