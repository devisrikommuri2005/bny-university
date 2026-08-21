import { usePortalData } from "../context/PortalDataContext.jsx";
import { PageHeader } from "./Dashboard.jsx";
 
export default function Programs() {
  const { data } = usePortalData();
 
  return (
    <div className="page">
      <PageHeader
        eyebrow="Grow"
        title="Programs"
        subtitle="Structured tracks available on your current account."
      />
 
      <div className="program-grid">
        {data.programs.map((p) => (
          <div className="program-card" key={p.id}>
            <div className="program-card-top">
              <h2>{p.name}</h2>
              <span className="badge badge-gold">{p.status}</span>
            </div>
            <p className="program-tagline">{p.tagline}</p>
            <p className="program-description">{p.description}</p>
            {p.resourceLink ? (
              <a
                href={p.resourceLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary program-resource-btn"
              >
                View resources ↗
              </a>
            ) : (
              <p className="empty-note program-resource-empty">Resources not added yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}