import { useAuth } from "../context/AuthContext.jsx";
import { usePortalData } from "../context/PortalDataContext.jsx";
import { useState, useEffect } from "react";
import { getTimeSheetsByDate, createTimeSheet, updateTimeSheet, deleteTimeSheet} from "../services/timeSheetService";
import Modal from "../components/Modal";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { data, updateMandatoryTrainingStatus } = usePortalData();
  const isFresher = currentUser?.track === "fresher";
  const [validationMessage, setValidationMessage] = useState("");
 
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
	const [validationMessage, setValidationMessage] = useState("");
	const [entries, setEntries] = useState([
	  {
	    id: null,
	    category: "",
	    description: "",
	    hours: ""
	  }
	]);
	
	const [selectedDate,
	    setSelectedDate] =
	    useState(
	      new Date()
	        .toISOString()
	        .slice(0, 10)
	    );
 
  const updateEntry = (id, field, value) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };
 
  const addRow = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: null,
        category: "",
        description: "",
        hours: ""
      }
    ]);
  };
	
	const loadData = async () => {
	  try {
	    const response =
	      await getTimeSheetsByDate(
	        selectedDate
	      );
		  setEntries(
		    response.data.length > 0
		      ? response.data.map(entry => ({
		          ...entry,
		          hours: String(entry.hours ?? "")
		        }))
		      : [
		          {
		            id: null,
		            category: "",
		            description: "",
		            hours: ""
		          }
		        ]
		  );
	  } catch (error) {
	    console.error(error);
	  }
	};
	
	useEffect(() => {
	  loadData();
	}, [selectedDate]);
	
	const saveTimesheet = async () => {

	  try {

		for (const entry of entries) {

		  if (!entry.category) {
			setValidationMessage("Please select a category");
		    return;
		  }

		  if (!entry.hours || Number(entry.hours) <= 0) {
		    setValidationMessage("Hours must be greater than 0");
		    return;
		  }

		  if (entry.category === "OTHERS" && !entry.description.trim()) {
		    setValidationMessage("Description is required for Others");
		    return;
		  }

		  const payload = {
		    entryDate: selectedDate,
		    category: entry.category,
		    description: entry.description,
		    hours: Number(entry.hours)
		  };

	      if (entry.id) {
		    await updateTimeSheet(
		      entry.id,
		      payload
		    );
		  } else {
		    await createTimeSheet(
		      payload
		    );
	      }
	    }
	    await loadData();
	    alert("Timesheet saved successfully");
		return;
	  } catch (error) {
	    console.error(error);
	  }
	};
	
	const removeRow = async (id) => {
	  try {
	    if (typeof id === "number" && id < 1000000000000) {
	      await deleteTimeSheet(id);
	    }
	    setEntries((prev) =>
	      prev.filter((e) => e.id !== id)
	    );
	  } catch (error) {
	    console.error(error);
	  }
	};
 
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
  
  useEffect(() => {
    if (!validationMessage) return;

    const handleEnter = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();

        setValidationMessage("");
      }
    };

    document.addEventListener("keydown", handleEnter, true);

    return () => {
      document.removeEventListener("keydown", handleEnter, true);
    };
  }, [validationMessage]);
 
  return (
    <>
      <SectionHeading title="Time Tracker Sheet" note="Available to freshers &amp; experienced hires" />
	  <Modal
	    open={!!validationMessage}
	    title="Validation Error"
	    onClose={() => setValidationMessage("")}
	  >
	    <p className="validation-modal-message">
	      {validationMessage}
	    </p>

	    <div className="validation-modal-actions">
	      <button
	        type="button"
	        className="btn btn-primary validation-ok-btn"
	        onClick={() => setValidationMessage("")}
	      >
	        OK
	      </button>
	    </div>
	  </Modal>
	  <div className="timesheet-filter">

	    <label>Date</label>

	    <input
	      type="date"
	      value={selectedDate}
	      onChange={(e) =>
	        setSelectedDate(
	          e.target.value
	        )
	      }
	    />

	  </div>
	  <table className="time-tracker-table">
        <thead>
          <tr>
			<th>Category</th>
			<th>Description</th>
            <th>Hours</th>
            <th aria-label="Remove row" />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
			  <td>
			    <select
			      value={e.category}
			      onChange={(ev) =>
			        updateEntry(
			          e.id,
			          "category",
			          ev.target.value
			        )
			      }
			    >
				  <option value="">Select Category</option>
			      <option value="INTERNAL_PROJECT">Internal Project</option>
			      <option value="TRAINING">Training</option>
			      <option value="KNOWLEDGE_SHARING">Knowledge Sharing</option>
			      <option value="MEETINGS">Meetings</option>
			      <option value="ADMINISTRATIVE_WORK">Administrative Work</option>
			      <option value="LEAVE">Leave</option>
			      <option value="INTERVIEWS">Interviews</option>
			      <option value="IDLE_TIME">Idle Time</option>
			      <option value="SELF_TRAINING">Self Training</option>
			      <option value="POC">POC</option>
			      <option value="OTHERS">Others</option>
			    </select>
			  </td>
			  <td>
			    <input
			      type="text"
			      placeholder="Description"
			      value={e.description}
			      onChange={(ev) =>
			        updateEntry(
			          e.id,
			          "description",
			          ev.target.value
			        )
			      }
			    />
			  </td>
              <td>
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="0"
                  value={e.hours}
                  onChange={(ev) => updateEntry(e.id, "hours", ev.target.value)}
                  className="hours-input"
                />
              </td>
			  <td> {entries.length > 1 && (
			      <button className="btn-ghost" onClick={() => removeRow(e.id)}>✕</button>
			    )}
			  </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="time-tracker-footer">
	  <button className="btn btn-secondary" onClick={addRow}>+ Add Row</button>
	  <button className="btn btn-primary" onClick={saveTimesheet}>Save Timesheet</button>
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