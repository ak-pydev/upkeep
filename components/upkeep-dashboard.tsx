"use client";

import { useEffect, useState } from "react";
import type { ChatResult, MaintenanceLog, Manual, Machine } from "@/lib/upkeep/types";
import { SiteNav } from "./site-nav";

type ApiListResponse<T> = {
  count: number;
  [key: string]: T[] | number;
};

type ManualCreateResponse = {
  manual: Manual;
  chunks: Array<{ id: string }>;
  indexStatus: "indexed" | "pending";
};

type LogCreateResponse = {
  log: MaintenanceLog;
};

type ChatResponse = ChatResult;

const demoPrompt = "Error code E32 on my Haas VF-2. What does it mean, what parts do I need, and how should I log the fix?";

function formatDate(value?: string) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusTone(status: Machine["status"]) {
  switch (status) {
    case "active":
      return "status-good";
    case "maintenance":
      return "status-warn";
    case "down":
      return "status-bad";
    default:
      return "status-muted";
  }
}

export function UpkeepDashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [question, setQuestion] = useState(demoPrompt);
  const [selectedManualIds, setSelectedManualIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [manualTitle, setManualTitle] = useState("Haas VF-2 Operator Manual");
  const [manualFilename, setManualFilename] = useState("haas-vf2-operator-manual.pdf");
  const [manualPages, setManualPages] = useState("412");
  const [manualNotes, setManualNotes] = useState("Indexed from the seeded E32 demo manual.");
  const [manualSourceText, setManualSourceText] = useState(
    "Alarm E32 indicates spindle encoder feedback mismatch. Inspect the spindle encoder cable, reseat the connectors, clear the alarm, and test at low spindle speed."
  );
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [logIssue, setLogIssue] = useState("");
  const [logResolution, setLogResolution] = useState("");
  const [logPartNumbers, setLogPartNumbers] = useState("");
  const [logStatus, setLogStatus] = useState<string | null>(null);

  const activeMachine = machines.find((machine) => machine.id === selectedMachineId) ?? null;
  const hasSetup = Boolean(activeMachine);
  const hasManualContext = manuals.length > 0;
  const hasAnswer = Boolean(answer);
  const flowStep = !hasSetup ? 1 : !hasManualContext ? 2 : !hasAnswer ? 3 : 4;
  const helperCopy =
    flowStep === 1
      ? "Start by choosing the machine you want help with."
      : flowStep === 2
        ? "Add manual text so Upkeep has something to search."
        : flowStep === 3
          ? "Ask your question in plain language."
          : "Review the answer, open any part links, and save the fix.";

  async function fetchMachines() {
    const response = await fetch("/api/machines", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load machines.");
    }
    const data = (await response.json()) as ApiListResponse<Machine> & { machines: Machine[] };
    setMachines(data.machines);
    const fallback = data.machines.find((machine) => machine.manufacturer === "Haas" && machine.model === "VF-2") ?? data.machines[0];
    if (fallback) {
      setSelectedMachineId((current) => current || fallback.id);
    }
  }

  async function fetchMachineData(machineId: string) {
    setRefreshing(true);
    setError(null);
    try {
      const [manualsResponse, logsResponse] = await Promise.all([
        fetch(`/api/manuals?machineId=${encodeURIComponent(machineId)}`, { cache: "no-store" }),
        fetch(`/api/logs?machineId=${encodeURIComponent(machineId)}`, { cache: "no-store" })
      ]);

      if (!manualsResponse.ok || !logsResponse.ok) {
        throw new Error("Unable to load machine data.");
      }

      const manualsData = (await manualsResponse.json()) as ApiListResponse<Manual> & { manuals: Manual[] };
      const logsData = (await logsResponse.json()) as ApiListResponse<MaintenanceLog> & { logs: MaintenanceLog[] };

      setManuals(manualsData.manuals);
      setLogs(logsData.logs);
      setSelectedManualIds((current) => {
        const next = manualsData.manuals.map((manual) => manual.id);
        if (current.length === 0) {
          return next;
        }
        return current.filter((id) => next.includes(id));
      });
      setManualFilename(
        manualsData.manuals[0]?.filename ?? "new-manual.pdf"
      );
      if (manualsData.manuals[0]) {
        setManualTitle(manualsData.manuals[0].title);
      }
      if (logsData.logs[0]) {
        setLogIssue(logsData.logs[0].issue);
        setLogResolution(logsData.logs[0].resolution);
        setLogPartNumbers(logsData.logs[0].partNumbers.join(", "));
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchMachines().catch((fetchError) => {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to start dashboard.");
    });
  }, []);

  useEffect(() => {
    if (!selectedMachineId) {
      return;
    }
    fetchMachineData(selectedMachineId).catch((fetchError) => {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load machine data.");
    });
  }, [selectedMachineId]);

  async function runChat(
    nextQuestion = question,
    overrides?: { machineId?: string; manualIds?: string[] }
  ) {
    if (!nextQuestion.trim()) {
      setError("Question is required.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = {
        question: nextQuestion,
        machineId: overrides?.machineId ?? (selectedMachineId || undefined),
        manualIds:
          overrides?.manualIds ??
          (selectedManualIds.length > 0 ? selectedManualIds : manuals.map((manual) => manual.id)),
        limit: 5
      };
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Unable to answer question.");
      }

      const data = (await response.json()) as ChatResponse;
      setAnswer(data);
      setLogIssue(data.logDraft.issue);
      setLogResolution(data.logDraft.resolution);
      setLogPartNumbers(data.logDraft.partNumbers.join(", "));
      if (data.logDraft.machineId) {
        setSelectedMachineId(data.logDraft.machineId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitManual() {
    if (!selectedMachineId) {
      setError("Select a machine before uploading a manual.");
      return;
    }

    setUploadStatus(null);
    setError(null);
    const response = await fetch("/api/manuals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        machineId: selectedMachineId,
        title: manualTitle.trim(),
        filename: manualFilename.trim(),
        pages: manualPages ? Number(manualPages) : undefined,
        notes: manualNotes.trim() || undefined,
        sourceText: manualSourceText.trim() || undefined
      })
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      throw new Error(body?.error?.message ?? "Unable to upload manual.");
    }

    const data = (await response.json()) as ManualCreateResponse;
    setUploadStatus(data.indexStatus === "indexed" ? "Manual indexed and attached to the machine." : "Manual saved. Add text to index it.");
    await fetchMachineData(selectedMachineId);
    setSelectedManualIds((current) => Array.from(new Set([...current, data.manual.id])));
    setManualFilename("new-manual.pdf");
    setManualTitle("New machine manual");
    setManualPages("");
    setManualNotes("");
    setManualSourceText("");
  }

  async function saveLog() {
    if (!selectedMachineId) {
      setError("Select a machine before logging a fix.");
      return;
    }

    setLogStatus(null);
    setError(null);

    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        machineId: selectedMachineId,
        issue: logIssue.trim(),
        resolution: logResolution.trim(),
        partNumbers: logPartNumbers
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
        sourceManualIds: selectedManualIds.length > 0 ? selectedManualIds : manuals.slice(0, 1).map((manual) => manual.id),
        createdBy: "demo-user"
      })
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      throw new Error(body?.error?.message ?? "Unable to save log.");
    }

    const data = (await response.json()) as LogCreateResponse;
    setLogs((current) => [data.log, ...current]);
    setLogStatus("Fix saved to maintenance history.");
  }

  function loadDemoPath() {
    const demoMachine = machines.find((machine) => machine.manufacturer === "Haas" && machine.model === "VF-2");
    if (demoMachine) {
      setSelectedMachineId(demoMachine.id);
      const demoManual = manuals.find((manual) => manual.machineId === demoMachine.id);
      setSelectedManualIds(demoManual ? [demoManual.id] : []);
    }
    setQuestion(demoPrompt);
    setLogStatus(null);
    setUploadStatus(null);
  }

  const selectedManuals = manuals.filter((manual) => selectedManualIds.includes(manual.id));

  return (
    <main className="page-shell">
      <SiteNav />
      <section className="dashboard-shell">
        <aside className="dashboard-rail">
          <section className="panel">
            <span className="eyebrow">Step 1</span>
            <h1>Choose what you need help with.</h1>
            <p>
              Pick a machine, then follow the guided flow below. The demo is
              preloaded with a Haas VF-2 example so you can try it immediately.
            </p>
            <p className="section-note consumer-note">Now: {helperCopy}</p>

            <label className="field-label" htmlFor="machine-select">
              Machine
            </label>
            <select
              id="machine-select"
              className="input"
              value={selectedMachineId}
              onChange={(event) => setSelectedMachineId(event.target.value)}
            >
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.manufacturer} {machine.model}
                  {machine.nickname ? ` - ${machine.nickname}` : ""}
                </option>
              ))}
            </select>

            {activeMachine ? (
              <div className="machine-summary">
                <div>
                  <strong>
                    {activeMachine.manufacturer} {activeMachine.model}
                  </strong>
                  <p>{activeMachine.nickname ?? "No nickname"}</p>
                </div>
                <span className={`status-pill ${statusTone(activeMachine.status)}`}>
                  {activeMachine.status}
                </span>
              </div>
            ) : null}

            <div className="mini-stats">
              <div>
                <span className="stat-number">{machines.length}</span>
                <span className="stat-caption">machines</span>
              </div>
              <div>
                <span className="stat-number">{manuals.length}</span>
                <span className="stat-caption">manuals</span>
              </div>
              <div>
                <span className="stat-number">{logs.length}</span>
                <span className="stat-caption">logs</span>
              </div>
            </div>

            <button className="button button-secondary button-block" type="button" onClick={loadDemoPath}>
              Load sample question
            </button>
          </section>

          <section className="panel">
            <span className="eyebrow">Step 2</span>
            <h2>Add manual text once.</h2>
            <p>
              Paste extracted manual text so Upkeep can search it. For the demo,
              the seeded Haas manual is already available.
            </p>

            <div className="stack">
              <label className="field-label" htmlFor="manual-title">Manual title</label>
              <input id="manual-title" className="input" value={manualTitle} onChange={(event) => setManualTitle(event.target.value)} />

              <label className="field-label" htmlFor="manual-filename">Filename</label>
              <input id="manual-filename" className="input" value={manualFilename} onChange={(event) => setManualFilename(event.target.value)} />

              <label className="field-label" htmlFor="manual-pages">Pages</label>
              <input id="manual-pages" className="input" value={manualPages} onChange={(event) => setManualPages(event.target.value)} inputMode="numeric" />

              <label className="field-label" htmlFor="manual-notes">Notes</label>
              <textarea id="manual-notes" className="input textarea" value={manualNotes} onChange={(event) => setManualNotes(event.target.value)} />

              <label className="field-label" htmlFor="manual-source">Extracted text</label>
              <textarea
                id="manual-source"
                className="input textarea textarea-large"
                value={manualSourceText}
                onChange={(event) => setManualSourceText(event.target.value)}
                placeholder="Paste OCR or extracted PDF text here so the manual can be indexed."
              />
            </div>

            <button className="button button-primary button-block" type="button" onClick={() => submitManual().catch((manualError) => setError(manualError instanceof Error ? manualError.message : "Unable to upload manual."))}>
              Add manual
            </button>
            {uploadStatus ? <p className="feedback success">{uploadStatus}</p> : null}
          </section>
        </aside>

        <section className="dashboard-main">
          <section className="panel hero-panel">
            <div className="panel-topline">
              <div>
                <span className="eyebrow">Step 3</span>
                <h1>Ask your question the normal way.</h1>
              </div>
              <div className="mode-badge">{loading ? "Finding answer" : "Ready"}</div>
            </div>
            <p className="section-note consumer-note">
              You do not need the right technical wording. Upkeep will search
              the manual, pull the best source, and suggest the next step.
            </p>

            <label className="field-label" htmlFor="chat-question">Troubleshooting prompt</label>
            <textarea
              id="chat-question"
              className="input textarea chat-input"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: My machine shows error E32. What does it mean and what should I check first?"
            />

            <div className="quick-actions">
              <button type="button" className="quick-chip" onClick={() => setQuestion(demoPrompt)}>
                Sample alarm question
              </button>
              <button type="button" className="quick-chip" onClick={() => setQuestion("What should I do if the spindle encoder cable is damaged?")}>
                Damaged cable
              </button>
              <button type="button" className="quick-chip" onClick={() => setQuestion("When was the last time we fixed this issue?")}>
                Previous fix
              </button>
            </div>

            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => runChat().catch((chatError) => setError(chatError instanceof Error ? chatError.message : "Unable to answer question."))}
                disabled={loading || refreshing}
              >
                {loading ? "Getting answer..." : "Get answer"}
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  const demoMachine = machines.find((machine) => machine.manufacturer === "Haas" && machine.model === "VF-2");
                  const demoManual = manuals.find((manual) => manual.machineId === demoMachine?.id);
                  loadDemoPath();
                  runChat(demoPrompt, {
                    machineId: demoMachine?.id,
                    manualIds: demoManual ? [demoManual.id] : []
                  }).catch((chatError) => setError(chatError instanceof Error ? chatError.message : "Unable to answer question."));
                }}
                disabled={loading || refreshing}
              >
                Run sample flow
              </button>
            </div>

            {error ? <p className="feedback error">{error}</p> : null}
          </section>

          <div className="results-grid">
            <section className="panel answer-panel">
              <span className="eyebrow">Step 4</span>
              <h2>Answer you can act on.</h2>
              {answer ? (
                <div className="answer-block">
                  <div className="answer-score">
                    <span>{Math.round(answer.confidence * 100)}%</span>
                    <p>confidence</p>
                  </div>
                  <pre className="answer-text">{answer.answer}</pre>
                  <div className="answer-meta">
                    <span>{answer.modeUsed === "claude" ? "AI answer" : "Fallback answer"}</span>
                    {answer.machine ? (
                      <span>
                        {answer.machine.manufacturer} {answer.machine.model}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="empty-state">Ask a question to see the answer, the source it came from, and what to do next.</p>
              )}
            </section>

            <section className="panel">
              <span className="eyebrow">Why this answer</span>
              <h2>Source text from the manual.</h2>
              {answer?.sources.length ? (
                <div className="stack">
                  {answer.sources.map((source) => (
                    <article key={source.chunkId} className="source-card">
                      <div className="source-head">
                        <strong>{source.manualTitle}</strong>
                        <span>page {source.pageNumber ?? "n/a"}</span>
                      </div>
                      <p>{source.excerpt}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">The supporting manual passage will appear here after you ask a question.</p>
              )}
            </section>
          </div>

          <div className="results-grid">
            <section className="panel">
              <span className="eyebrow">Next actions</span>
              <h2>Likely parts to review.</h2>
              {answer?.partSuggestions.length ? (
                <div className="stack">
                  {answer.partSuggestions.map((part) => (
                    <article key={part.label} className="part-card">
                      <div className="source-head">
                        <strong>{part.label}</strong>
                        <span>{part.reason}</span>
                      </div>
                      <div className="vendor-links">
                        {part.vendorLinks.map((vendor) => (
                          <a key={vendor.vendor} className="vendor-link" href={vendor.searchUrl} target="_blank" rel="noreferrer">
                            {vendor.vendor}
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">If the answer mentions a likely replacement part, it will appear here with direct search links.</p>
              )}
            </section>

            <section className="panel">
              <span className="eyebrow">Save it</span>
              <h2>Keep the fix for the next person.</h2>
              <div className="stack">
                <label className="field-label" htmlFor="log-issue">Issue</label>
                <textarea id="log-issue" className="input textarea" value={logIssue} onChange={(event) => setLogIssue(event.target.value)} />
                <label className="field-label" htmlFor="log-resolution">Resolution</label>
                <textarea id="log-resolution" className="input textarea" value={logResolution} onChange={(event) => setLogResolution(event.target.value)} />
                <label className="field-label" htmlFor="log-parts">Part numbers</label>
                <input id="log-parts" className="input" value={logPartNumbers} onChange={(event) => setLogPartNumbers(event.target.value)} />
              </div>
              <button className="button button-primary button-block" type="button" onClick={() => saveLog().catch((logError) => setError(logError instanceof Error ? logError.message : "Unable to save log."))}>
                Save this fix
              </button>
              {logStatus ? <p className="feedback success">{logStatus}</p> : null}
            </section>
          </div>

          <section className="panel">
            <span className="eyebrow">History</span>
            <h2>Previous answers and saved fixes.</h2>
            {selectedManuals.length ? (
              <p className="section-note">
                Manuals currently attached: {selectedManuals.map((manual) => manual.title).join(", ")}
              </p>
            ) : null}
            <div className="timeline">
              {logs.length ? (
                logs.map((log) => (
                  <article key={log.id} className="timeline-item">
                    <div className="timeline-meta">
                      <strong>{log.issue}</strong>
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                    <p>{log.resolution}</p>
                    <div className="chip-row">
                      {log.partNumbers.map((part) => (
                        <span key={part} className="tiny-chip">
                          {part}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">No logs have been loaded for the selected machine yet.</p>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
