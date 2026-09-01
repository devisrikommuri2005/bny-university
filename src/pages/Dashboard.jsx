import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { usePortalData } from "../context/PortalDataContext.jsx";
 
export default function Dashboard() {
  const { currentUser } = useAuth();
  const { data, updateMandatoryTrainingStatus } = usePortalData();
  const isFresher = currentUser?.track === "fresher";
 
  return (
    <div className="page">
      <PageHeader
        eyebrow="Home"
        title={`Welcome back, ${currentUser?.name?.split(" ")[0]}`}
        subtitle={
          isFresher
            ? "Here's everything you need to get fully onboarded."
            : "Here's your Point of Contact and your time tracker."
        }
      />
 
      <div className="dashboard-grid">
        <section className="card section-card">
          <SectionHeading title="Point of Contact" note="Who to reach out to" />
          <div className="poc-list">
            {data.poc.map((p) => (
              <div className="poc-card" key={p.id}>
                <div className="poc-avatar" aria-hidden="true">
                  {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="poc-name">{p.name}</p>
                  <p className="poc-role">{p.role}</p>
                  <p className="poc-contact">{p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
 
        {(
          <section className="card section-card">
            <SectionHeading title="Onboarding Files" note={`${data.onboardingFiles.length} documents`} />
            <ul className="link-list file-link-list">
              {data.onboardingFiles.map((f) =>
                f.link ? (
                  <li key={f.id}>
                    <a href={f.link} rel="noreferrer">
                      <span className="file-icon" aria-hidden="true">{fileIcon(f.title)}</span>
                      {f.title}
                    </a>
                  </li>
                ) : (
                  <li key={f.id} className="file-link-empty">
                    <span className="file-icon" aria-hidden="true">{fileIcon(f.title)}</span>
                    {f.title}
                    <span className="empty-note"> — link not added yet</span>
                  </li>
                )
              )}
            </ul>
          </section>
        )}
 
        {(
          <section className="card section-card">
            <SectionHeading title="Mandatory Trainings" note={`${data.mandatoryTrainings.length} required`} />
            <ul className="training-check-list">
              {data.mandatoryTrainings.map((t) => (
                <li key={t.id} className="training-check-item">
                  <div>
                    <a href={t.link} target="_blank" rel="noreferrer" className="training-link">{t.title}</a>
                    <span className={`badge ${t.status === "Completed" ? "badge-sage" : "badge-rose"}`}>
                      {t.status}
                    </span>
                  </div>
                  <select
                    value={t.status}
                    onChange={(e) => updateMandatoryTrainingStatus(t.id, e.target.value)}
                    aria-label={`Update status for ${t.title}`}
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </li>
              ))}
            </ul>
          </section>
        )}
 
        <section className="card section-card">
          <TimeTracker />
        </section>
      </div>
    </div>
  );
}
 
function TimeTracker() {
  const [entries, setEntries] = useState([
    { id: 1, date: new Date().toISOString().slice(0, 10), hours: "", task: "" },
  ]);
 
  const updateEntry = (id, field, value) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };
 
  const addRow = () => {
    setEntries((prev) => [...prev, { id: Date.now(), date: new Date().toISOString().slice(0, 10), hours: "", task: "" }]);
  };
 
  const removeRow = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
 
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
 
  return (
    <>
      <SectionHeading title="Time Tracker Sheet" note="Available to freshers &amp; experienced hires" />
      <table className="time-tracker-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Task / Project</th>
            <th>Hours</th>
            <th aria-label="Remove row" />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td>
                <input type="date" value={e.date} onChange={(ev) => updateEntry(e.id, "date", ev.target.value)} />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="e.g. Client onboarding call"
                  value={e.task}
                  onChange={(ev) => updateEntry(e.id, "task", ev.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  placeholder="0"
                  value={e.hours}
                  onChange={(ev) => updateEntry(e.id, "hours", ev.target.value)}
                  className="hours-input"
                />
              </td>
              <td>
                <button className="btn-ghost" onClick={() => removeRow(e.id)} aria-label="Remove entry">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="time-tracker-footer">
        <button className="btn btn-secondary" onClick={addRow}>+ Add row</button>
        <span className="time-tracker-total">Total: <strong>{total}</strong> hrs</span>
      </div>
    </>
  );
}
 
function fileIcon(title) {
  const t = title.toLowerCase();
  if (t.includes(".pptx") || t.includes(".ppt")) return "📊";
  if (t.includes(".xlsx") || t.includes(".xls") || t.includes(".csv")) return "📈";
  if (t.includes(".docx") || t.includes(".doc")) return "📄";
  if (t.includes(".msg") || t.includes(".eml")) return "✉️";
  if (t.includes(".pdf")) return "📕";
  return "📁";
}
 
export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="page-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}
 
export function SectionHeading({ title, note }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {note && <span className="section-note">{note}</span>}
    </div>
  );
}