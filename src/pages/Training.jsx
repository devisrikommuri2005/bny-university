import { useState, useEffect } from "react";
import { usePortalData } from "../context/PortalDataContext.jsx";
import { PageHeader, SectionHeading } from "./Dashboard.jsx";
import {getIntroductionTrainings, getDomainTrainings, getFunctionalTrainings} from "../services/trainingService";
import {getRecordedSessions} from "../services/recordedSessionService";

const TABS = [
  { id: "intro", label: "Introduction to Account" },
  { id: "domain", label: "Domain Specific Training" },
  { id: "functional", label: "Functional Training" },
  { id: "interview", label: "Interview Prep & FAQs" },
];

export default function Training() {
  const { data } = usePortalData();
  const [tab, setTab] = useState("intro");
  const [introTrainings, setIntroTrainings] = useState([]);
  const [domainTrainings, setDomainTrainings] = useState([]);
  const [functionalTrainings, setFunctionalTrainings] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState({});
		
  useEffect(() => {
    const loadTrainings = async () => {
        try {
          const intro = await getIntroductionTrainings();

          const domain = await getDomainTrainings();

          const functional = await getFunctionalTrainings();

          setIntroTrainings(intro.data);

          setDomainTrainings(domain.data);

          setFunctionalTrainings(functional.data);

        } catch (error) {
          console.error(error);
        }
      };
    loadTrainings();
  }, []);
  
  useEffect(() => {
      const loadSessions = async () => {
              const sessions = {};
              for (const training of functionalTrainings) {
                  try {
                      const response = await getRecordedSessions(training.id);
                      sessions[training.id] = response.data;
                  } catch (error) {
                      console.error(error);
                  }
              }
              setRecordedSessions(
                  sessions
              );
          };
      if (functionalTrainings.length > 0) {
          loadSessions();
      }
  }, [functionalTrainings]);
  
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
            {introTrainings.map((item) => (
              <li key={item.id}>
                <a href={item.sharePointUrl} target="_blank" rel="noreferrer">{item.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "domain" && (
        <section className="card section-card">
          <SectionHeading title="Domain Specific Training" note={`${domainTrainings.length} tracks`} />
          <div className="tile-grid">
            {domainTrainings.map((d) => (
              <a className="domain-tile" key={d.id} href={d.sharePointUrl} target="_blank" rel="noreferrer">
                <span>{d.title}</span>
                <span className="domain-tile-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

	  {tab === "functional" && (
	    <section className="card section-card">
	      <SectionHeading
	        title="Functional Training"
	        note="Technologies and course materials"
	      />

	      <div className="functional-list">
	        {functionalTrainings.map((ft) => (
	          <div
	            className="functional-item"
	            key={ft.id}
	          >
	            <div className="functional-item-head">

	              <h3>{ft.title}</h3>
				 <a
	              href = {ft.sharePointUrl}>
	                Course Material →
	              </a>
	            </div>
	            <p className="empty-note">
	              {ft.description}
	            </p>
				{(recordedSessions[ft.id] || []).length > 0 ? (
				    <ul className="recording-list">
				        {(recordedSessions[ft.id] || [])
				            .map(session => (
				            <li key={session.id}>
				                <a href = {session.recordingUrl}>
				                    ▶ {session.title}
				                </a>

				            </li>
				        ))}
				    </ul>

				) : (

				    <p className="empty-note">
				        No recorded sessions yet.
				    </p>

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
