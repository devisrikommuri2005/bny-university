import { useState } from "react";
import { usePortalData } from "../context/PortalDataContext.jsx";
import { PageHeader, SectionHeading } from "./Dashboard.jsx";

const TABS = [
  { id: "intro", label: "Introduction to Account" },
  { id: "domain", label: "Domain Specific Training" },
  { id: "functional", label: "Functional Training" },
  { id: "interview", label: "Interview Prep & FAQs" },
];

export default function Training() {
  const { data } = usePortalData();
  const [tab, setTab] = useState("intro");

  return (
    <div className="page">
      <PageHeader
        eyebrow="Learning"
        title="Training Section"
        subtitle="From account fundamentals to client-interview readiness."
      />

      <div className="pill-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`pill-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "intro" && (
        <section className="card section-card">
          <SectionHeading title="Introduction to Account" note="Start here" />
          <ul className="link-list">
            {data.introToAccount.map((item) => (
              <li key={item.id}>
                <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "domain" && (
        <section className="card section-card">
          <SectionHeading title="Domain Specific Training" note={`${data.domainTrainings.length} tracks`} />
          <div className="tile-grid">
            {data.domainTrainings.map((d) => (
              <a className="domain-tile" key={d.id} href={d.link} target="_blank" rel="noreferrer">
                <span>{d.name}</span>
                <span className="domain-tile-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {tab === "functional" && (
        <section className="card section-card">
          <SectionHeading title="Functional Training" note="Technologies + recorded sessions" />
          <div className="functional-list">
            {data.functionalTrainings.map((ft) => (
              <div className="functional-item" key={ft.id}>
                <div className="functional-item-head">
                  <h3>{ft.tech}</h3>
                  <a href={ft.link} target="_blank" rel="noreferrer" className="btn-ghost">Course material →</a>
                </div>
                {ft.recordings.length > 0 ? (
                  <ul className="recording-list">
                    {ft.recordings.map((r) => (
                      <li key={r.id}>
                        <a href={r.url} target="_blank" rel="noreferrer">▶ {r.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-note">No recorded sessions yet — check back soon.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "interview" && (
        <section className="card section-card">
          <SectionHeading title="Interview Questions" note="For client interviews" />
          <ul className="qa-list">
            {data.interviewPrep.questions.map((q) => (
              <li key={q.id}>
                <span className="badge badge-periwinkle">{q.tag}</span>
                <p>{q.q}</p>
              </li>
            ))}
          </ul>

          <div className="section-divider" />

          <SectionHeading title="FAQs" note="Technology &amp; process" />
          <div className="faq-list">
            {data.interviewPrep.faqs.map((f) => (
              <details className="faq-item" key={f.id}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
