import { useState, useEffect } from "react";
import { usePortalData } from "../context/PortalDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { exportAllData } from "../data/mockData.js";
import { PageHeader, SectionHeading } from "./Dashboard.jsx";
import Modal from "../components/Modal.jsx";
import {createPOC,updatePOCById,deletePOCById,getAllPOCs} from "../services/adminPocService";
import {getAssignedEmployees,assignEmployeeToPoc} from "../services/pocAssignmentService";
import { getAllUsers } from "../services/userService";
import {createOnboardingFile,updateOnboardingFileById,deleteOnboardingFileById} from "../services/adminOnboardingFileService";
import {getOnboardingFiles } from "../services/onboardingFileService";
import {createMandatoryTraining,updateMandatoryTrainingById,deleteMandatoryTrainingById} from "../services/adminMandatoryTrainingService"; 
import {createRecordedSession, deleteRecordedSession, getRecordedSessions} from "../services/recordedSessionService";
import {getFunctionalTrainings} from "../services/trainingService";
import {getAllTrainings, createTraining, updateTrainingById, deleteTrainingById} from "../services/adminTrainingService";
import {getAllPrograms, createProgram, updateProgramById, deleteProgramById} from "../services/adminProgramService";
import {getMandatoryTrainings} from "../services/mandatoryTrainingService";

const TABS = [
  { id: "users", label: "Manage Users" },
  { id: "poc", label: "Points of Contact" },
  { id: "files", label: "Onboarding Files" },
  { id: "onboarding", label: "Mandatory Trainings" },
  { id: "training", label: "Training Management" },
  { id: "sessions", label: "Recorded Sessions" },
  { id: "prep", label: "Interview Prep & FAQs" },
  { id: "programs", label: "Programs" },
];
 
export default function Admin() {
  const [tab, setTab] = useState("users");
 
  return (
    <div className="page">
      <div className="admin-header-row">
        <PageHeader
          eyebrow="Admin"
          title="Manage the portal"
          //subtitle="Edits save instantly and reflect for every signed-in user."
        />
        <button className="btn btn-secondary" onClick={exportAllData}>
          Export data (JSON)
        </button>
      </div>
 
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
 
      {tab === "users" && <UsersAdmin />}
      {tab === "poc" && <PocAdmin />}
      {tab === "files" && <OnboardingFilesAdmin />}
      {tab === "onboarding" && <MandatoryTrainingAdmin />}
	  {tab === "training" && <TrainingAdmin />}
      {tab === "sessions" && <RecordingsAdmin />}
      {tab === "prep" && <InterviewPrepAdmin />}
      {tab === "programs" && <ProgramsAdmin />}
    </div>
  );
}
 
// -------------------------------------------------------------- Users ----
function UsersAdmin() {
  const { users, addUser, updateUser, removeUser } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "user", track: "fresher", domain: "",
  });
  const [removeError, setRemoveError] = useState("");
 
  const add = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    addUser({
      ...form,
      track: form.role === "admin" ? null : form.track,
      domain: form.role === "admin" ? null : form.domain,
    });
    setForm({ name: "", email: "", password: "", role: "user", track: "fresher", domain: "" });
  };
 
  const handleRemove = (id) => {
    const result = removeUser(id);
    setRemoveError(result.ok ? "" : result.message);
  };
 
  return (
    <section className="card section-card">
      <SectionHeading title="Manage Users" note={`${users.length} accounts`} />
      {removeError && <p className="field-error" style={{ marginBottom: 12 }}>{removeError}</p>}
 
      <div className="admin-table">
        {users.map((u) => (
          <div className="admin-row stacked" key={u.id}>
            <FormField label="Name" value={u.name} onChange={(v) => updateUser(u.id, { name: v })} />
            <FormField label="Email" type="email" value={u.email} onChange={(v) => updateUser(u.id, { email: v })} />
            <FormField label="Password" value={u.password} onChange={(v) => updateUser(u.id, { password: v })} />
            <label className="field-label">Role</label>
            <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value })}>
              <option value="user">Employee</option>
              <option value="admin">Admin</option>
            </select>
            {u.role === "user" && (
              <>
                <label className="field-label">Track</label>
                <select value={u.track || "fresher"} onChange={(e) => updateUser(u.id, { track: e.target.value })}>
                  <option value="fresher">Fresher</option>
                  <option value="experienced">Experienced</option>
                </select>
              </>
            )}
            <button
              className="btn-ghost danger"
              onClick={() => handleRemove(u.id)}
              style={{ alignSelf: "flex-start" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
 
      <SectionHeading title="Add a new user" />
      <form className="inline-add-form stacked" onSubmit={add}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Employee</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "user" && (
          <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </select>
        )}
        <button type="submit" className="btn btn-primary">+ Add user</button>
      </form>
    </section>
  );
}
 
// ---------------------------------------------------------------- POC ----
function PocAdmin() {
  const { data } = usePortalData();
  const [editing, setEditing] = useState(null); // poc object or "new"
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "", slack: "" });
  const [employees, setEmployees] = useState({});
  const [allPocs, setAllPocs] = useState([]);
  const [assigningPoc, setAssigningPoc] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  useEffect(() => {

    const loadAllEmployees = async () => {
        const employeeData = {};
        for (const p of allPocs) {
          try {
			const response =
			  await getAssignedEmployees(p.id);

			console.log(
			  "POC",
			  p.id,
			  response
			);
			  
            employeeData[p.id] =
              response;
          } catch (error) {
            console.error(error);
          }
        }
        setEmployees(
          employeeData
        );
      };
	  
    if (allPocs.length > 0) {
      loadAllEmployees();
    }
  }, [allPocs]);
  
  
    const loadPocs = async () => {
        try {
          const response = await getAllPOCs();
          setAllPocs(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };
	  useEffect(() => {
		  loadPocs();
	  }, []);
  
  useEffect(() => {

    const loadUsers = async () => {

      try {

        const response =
          await getAllUsers();

        setUsers(response);

      } catch (error) {

        console.error(error);
      }
    };

    loadUsers();

  }, []);
  
  const openEdit = (poc) => {
    setEditing(poc);
    setForm(poc ? { ...poc } : { name: "", role: "", email: "", phone: "", slack: "" });
  };
 
  const save = async (e) => {

    e.preventDefault();

    try {
      if (editing === "new" || !editing) {
        await createPOC(form);
      } else {
        await updatePOCById(editing.id,form);
      }
      setEditing(null);
	  await loadPocs();
    } catch (error) {
      console.error("Failed to save POC",error);
    }
  };
  
  const assignEmployee =
    async () => {
      try {
        await assignEmployeeToPoc(
          Number(selectedUserId),
          assigningPoc.id
        );
        await loadPocs();
		setAssigningPoc(null);
		setSelectedUserId("");
      } catch (error) {
        console.error(error);
      }
  };
  
  const loadEmployees =
    async (pocId) => {
      try {
        const response = await getAssignedEmployees(pocId);
        setEmployees(prev => ({
          ...prev,
          response
        }));
      } catch (error) {
        console.error(error);
      }
  };
 
  return (
    <section className="card section-card">
      <SectionHeading title="Points of Contact" note={`${allPocs.length} listed`} />
	  <div className="admin-table">
	    {allPocs.map((p) => (
	      <div className="admin-row" key={p.id}>
	        <div>
	          <p className="poc-name">{p.name}</p>
	          <p className="poc-role">{p.designation} · {p.email} · {p.phoneNumber}</p>
	          <div className="assigned-employees">
	            <strong>Assigned Employees: </strong>
	            <ul>
	              {(employees[p.id] || []).map((emp) => (
	                <li key={emp}>
	                  {emp}
	                </li>
	              ))}
	            </ul>
	          </div>
	        </div>
			
			<div className="admin-row-actions">
			  <button className="btn btn-primary" onClick={() => setAssigningPoc(p)}>
			    + Assign
			  </button>

			  <button className="btn btn-secondary" onClick={() => openEdit(p)} >
			    Edit
			  </button>

			  <button className="btn-ghost danger" onClick={async () => {
			      await deletePOCById(p.id);
			      await loadPocs();
			    }}>
			    Remove
			  </button>
			</div>
	      </div>
	    ))}
	  </div>
	  
      <button className="btn btn-primary" onClick={() => openEdit("new")}>+ Add POC</button>
 
      <Modal open={!!editing} title={editing === "new" ? "Add POC" : "Edit POC"} onClose={() => setEditing(null)}>
        <form onSubmit={save}>
          <FormField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <FormField label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} required />
          <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <FormField label="Slack handle" value={form.slack} onChange={(v) => setForm({ ...form, slack: v })} />
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
	  <Modal open={!!assigningPoc} title="Assign Employee" onClose={() => setAssigningPoc(null)}>

	    <label className="field-label">
	      Select Employee
	    </label>

	    <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
	      <option value="">Select Employee</option>
		  {users.filter(user => !(employees[assigningPoc?.id] || []).includes(user.name))
		    .map(user => (
		      <option key={user.id} value={user.id}>{user.name}</option>
		  ))}
	    </select>

	    <div className="modal-actions">

	      <button className="btn btn-secondary" onClick={() => setAssigningPoc(null)}>
	        Cancel
	      </button>

	      <button className="btn btn-primary" onClick={assignEmployee}>
			Assign
	      </button>
	    </div>
	  </Modal>
    </section>
  );
}
 
// ------------------------------------------------------- Onboarding Files
function OnboardingFilesAdmin() {
	const [onboardingFiles, setOnboardingFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({title: "",link: ""});
  
  const loadOnboardingFiles =
    async () => {
      try {
        const response =
          await getOnboardingFiles();
        setOnboardingFiles(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };
	
	useEffect(() => {
	  loadOnboardingFiles();
	}, []);
  
  const openEdit = (file) => {
    setEditing(file);
    setForm({
      title: file.title,
      link: file.sharePointUrl || file.link
    });
  };
  
  const cancelEdit = () => {
    setEditing(null);
    setForm({
      title: "",
      link: ""
    });
  };
 
  const add = async (e) => {
    e.preventDefault();
    if (!form.title)
      return;
    try {
      if (editing) {
        await updateOnboardingFileById(
          editing.id,
          form
        );
      } else {
        await createOnboardingFile(
          form
        );
      }
      await loadOnboardingFiles();
      cancelEdit();
    } catch (error) {
      console.error(error);
    }
  };
 
  return (
    <section className="card section-card">
      <SectionHeading title="Onboarding Files" note={`${onboardingFiles.length} documents · shown to freshers`} />
      <div className="admin-table">
        {onboardingFiles.map((f) => (
          <div className="admin-row stacked" key={f.id}>
		  <p>
		    <strong>
		      {f.title}
		    </strong>
		  </p>

		  <p>
		    {f.sharePointUrl}
		  </p>

		  <div className="admin-row-actions">
		    <button
		      className="btn btn-secondary"
		      onClick={() =>
		        openEdit(f)
		      }
		    >
		      Edit
		    </button>
			
		    <button
		      className="btn-ghost danger"
		      onClick={async () => {
		        await deleteOnboardingFileById(
		          f.id
		        );
				await loadOnboardingFiles();
		      }}
		    >
		      Remove
		    </button>
		  </div>
          </div>
        ))}
      </div>
      <form className="inline-add-form" onSubmit={add}>
        <input placeholder="File title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Link (optional, add later)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
		<button
		  type="submit"
		  className="btn btn-primary"
		>
		  {editing
		    ? "Update File"
		    : "+ Add File"}
		</button>
		{editing && (
		  <button
		    type="button"
		    className="btn btn-secondary"
		    onClick={cancelEdit}
		  >
		    Cancel Edit
		  </button>
		)}
      </form>
    </section>
  );
}
 
// ------------------------------------------------------------- Training
function TrainingAdmin() {

  const [trainings, setTrainings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
      title: "",
      description: "",
      sharePointUrl: "",
      trainingType: "FUNCTIONAL",
      active: true
    });


    const loadTrainings = async () => {
        try {
          const response = await getAllTrainings();
          setTrainings(response.data);
        } catch (error) {
          console.error(error);
        }
      };
	  useEffect(() => {
		  loadTrainings();
	  }, []);

  const addTraining = async (e) => {
      e.preventDefault();
      try {
        if (editing) {
          await updateTrainingById(editing.id, form);
        } else {
          await createTraining(form);
        }
        await loadTrainings();
      } catch (error) {
        console.error(error);
      }
    };

  const openEdit = (training) => {
      setEditing(training);
      setForm({
        title: training.title,
        description: training.description,
        sharePointUrl: training.sharePointUrl,
        trainingType: training.trainingType,
        active: training.active
      });
    };

  const cancelEdit = () => {
      setEditing(null);
      setForm({
        title: "",
        description: "",
        sharePointUrl: "",
        trainingType: "FUNCTIONAL",
        active: true
      });
    };

  return (

    <section className="card section-card">

      <SectionHeading title="Training Management" note={`${trainings.length} trainings`}/>
      <div className="admin-table">
        {trainings.map((training) => (
          <div
            className="admin-row stacked"
            key={training.id}
          >
            <p>
              <strong>
                {training.title}
              </strong>
            </p>

            <p>
              {training.trainingType}
            </p>

            <p>
              {training.description}
            </p>

            <p>
              {training.sharePointUrl}
            </p>

            <div className="admin-row-actions">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  openEdit(training)
                }
              >
                Edit
              </button>

              <button
                className="btn-ghost danger"
                onClick={async () => {
                  await deleteTrainingById(
                    training.id
                  );
				  await loadTrainings();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        className="inline-add-form stacked"
        onSubmit={addTraining}
      >

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value
            })
          }
        />

        <textarea
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <input
          placeholder="SharePoint URL"
          value={form.sharePointUrl}
          onChange={(e) =>
            setForm({
              ...form,
              sharePointUrl:
                e.target.value
            })
          }
        />

        <select
          value={form.trainingType}
          onChange={(e) =>
            setForm({
              ...form,
              trainingType:
                e.target.value
            })
          }
        >

          <option value="INTRODUCTION">
            INTRODUCTION
          </option>

          <option value="DOMAIN">
            DOMAIN
          </option>

          <option value="FUNCTIONAL">
            FUNCTIONAL
          </option>

        </select>

        <button
          type="submit"
          className="btn btn-primary"
        >
          {editing
            ? "Update Training"
            : "+ Add Training"}
        </button>

        {editing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cancelEdit}
          >
            Cancel Edit
          </button>

        )}
      </form>
    </section>
  );
}
// ---------------------------------------------------- Mandatory Trainings
function MandatoryTrainingAdmin() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({title: "", link: ""});
  const [mandatoryTrainings, setMandatoryTrainings] = useState([]);
  
  const loadMandatoryTrainings =
    async () => {

      try {

        const response =
          await getMandatoryTrainings();

        setMandatoryTrainings(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
  };
  
  useEffect(() => {

    loadMandatoryTrainings();

  }, []);
  
  const openEdit = (training) => {
    setEditing(training);
    setForm({
      title: training.title,
      link: training.link || training.sharePointUrl
    });
  };
  
  const cancelEdit = () => {
    setEditing(null);
    setForm({
      title: "",
      link: ""
    });
  };
 
  const add = async (e) => {
    e.preventDefault();
    if (!form.title || !form.link)
      return;
    try {
      if (editing) {
        await updateMandatoryTrainingById(
          editing.id,
          form
        );
      } else {
        await createMandatoryTraining(
          form
        );
      }
	  await loadMandatoryTrainings();
	  cancelEdit();
    } catch (error) {
      console.error(error);
    }
  };  
 
  return (
    <section className="card section-card">
      <SectionHeading title="Mandatory Trainings" note={`${mandatoryTrainings.length} required for freshers`} />
      <div className="admin-table">
        {mandatoryTrainings.map((t) => (
          <div className="admin-row stacked" key={t.id}>
		  <p>
		    <strong>
		      {t.title}
		    </strong>
		  </p>

		  <p>
		    {t.sharePointUrl || t.link}
		  </p>

		  <div className="admin-row-actions">

		    <button
		      className="btn btn-secondary"
		      onClick={() =>
		        openEdit(t)
		      }
		    >
		      Edit
		    </button>

		    <button
		      className="btn-ghost danger"
		      onClick={async () => {

		        await deleteMandatoryTrainingById(
		          t.id
		        );
				await loadMandatoryTrainings();
				cancelEdit();
		      }}
		    >
		      Remove
		    </button>

		  </div>
            
          </div>
        ))}
      </div>
      <form className="inline-add-form" onSubmit={add}>
        <input placeholder="Training title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Link (URL)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
		<button
		  type="submit"
		  className="btn btn-primary"
		>
		  {editing
		    ? "Update Training"
		    : "+ Add"}
		</button>
		{editing && (

		  <button
		    type="button"
		    className="btn btn-secondary"
		    onClick={cancelEdit}
		  >
		    Cancel Edit
		  </button>

		)}
      </form>
    </section>
  );
}

// ------------------------------------------------------------- Sessions
function RecordingsAdmin() {
  const [functionalTrainings, setFunctionalTrainings] = useState([]);
  const [sessions, setSessions] = useState({});
  const [selectedFt, setSelectedFt] = useState("");
  const [form, setForm] = useState({ title: "", url: "" });

    const loadData = async () => {
        try {
          const response = await getFunctionalTrainings();
          const trainings = response.data;
          setFunctionalTrainings(trainings);
          if (trainings.length > 0) {
            setSelectedFt(trainings[0].id);
          }
        } catch (error) {
          console.error(error);
        }
      };
	  useEffect(() => {
	    	loadData();
	  }, []);
  
  
    const loadSessions = async () => {
        const data = {};
        for (const training of functionalTrainings) {
          try {
            const response = await getRecordedSessions(training.id);
            data[training.id] = response.data;
          } catch (error) {
            console.error(error);
          }
        }
        setSessions(data);
      };
	  useEffect(() => {
		    if (functionalTrainings.length > 0) {
		      loadSessions();
		    }
	 }, [functionalTrainings]);
	  
  const add = async (e) => {
    e.preventDefault();
    if (!selectedFt || !form.title || !form.url)
      return;

    try {
      await createRecordedSession(
        {
          title: form.title,
          recordingUrl: form.url,
          trainingId:
            Number(selectedFt)
        }
      );
	  setForm({
		  title: "",
		  url: ""
	  });
	  await loadSessions();
    } catch (error) {
      console.error(error);
    }
  };
 
  return (
    <section className="card section-card">
      <SectionHeading title="Recorded Sessions" note="Attach a recording to a Functional Training technology" />
 
      <form className="inline-add-form" onSubmit={add}>
        <select value={selectedFt} onChange={(e) => setSelectedFt(e.target.value)}>
          {functionalTrainings.map((ft) => (
            <option value={ft.id} key={ft.id}>{ft.title}</option>
          ))}
        </select>
        <input placeholder="Session title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Recording URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <button type="submit" className="btn btn-primary">+ Add session</button>
      </form>
 
      <div className="functional-list">
        {functionalTrainings.map((ft) => (
          <div className="functional-item" key={ft.id}>
            <div className="functional-item-head">
              <h3>{ft.title}</h3>
            </div>
            {(sessions[ft.id] || []).length === 0 ? (
              <p className="empty-note">No sessions added yet.</p>
            ) : (
              <ul className="recording-list">
                {(sessions[ft.id] || []).map((r) => (
                  <li key={r.id} className="admin-row">
                    <a href={r.recordingUrl} target="_blank" rel="noreferrer">▶ {r.title}</a>
					<button className="btn-ghost danger" onClick={async () => {
						await deleteRecordedSession(r.id);
						await loadSessions();
					}}
					>
					Remove
					</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------- Interview prep
function InterviewPrepAdmin() {
  const { data, addInterviewQuestion, addFaq } = usePortalData();
  const [q, setQ] = useState({ q: "", tag: "" });
  const [faq, setFaq] = useState({ q: "", a: "" });
 
  const submitQ = (e) => {
    e.preventDefault();
    if (!q.q) return;
    addInterviewQuestion(q);
    setQ({ q: "", tag: "" });
  };
 
  const submitFaq = (e) => {
    e.preventDefault();
    if (!faq.q || !faq.a) return;
    addFaq(faq);
    setFaq({ q: "", a: "" });
  };
 
  return (
    <section className="card section-card">
      <SectionHeading title="Interview Questions" note={`${data.interviewPrep.questions.length} listed`} />
      <ul className="qa-list">
        {data.interviewPrep.questions.map((item) => (
          <li key={item.id}>
            <span className="badge badge-periwinkle">{item.tag}</span>
            <p>{item.q}</p>
          </li>
        ))}
      </ul>
      <form className="inline-add-form" onSubmit={submitQ}>
        <input placeholder="Tag (e.g. Java, General)" value={q.tag} onChange={(e) => setQ({ ...q, tag: e.target.value })} />
        <input placeholder="Question" value={q.q} onChange={(e) => setQ({ ...q, q: e.target.value })} />
        <button type="submit" className="btn btn-primary">+ Add question</button>
      </form>
 
      <div className="section-divider" />
 
      <SectionHeading title="FAQs" note={`${data.interviewPrep.faqs.length} listed`} />
      <div className="faq-list">
        {data.interviewPrep.faqs.map((f) => (
          <details className="faq-item" key={f.id}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <form className="inline-add-form stacked" onSubmit={submitFaq}>
        <input placeholder="Question" value={faq.q} onChange={(e) => setFaq({ ...faq, q: e.target.value })} />
        <textarea placeholder="Answer" value={faq.a} onChange={(e) => setFaq({ ...faq, a: e.target.value })} rows={2} />
        <button type="submit" className="btn btn-primary">+ Add FAQ</button>
      </form>
    </section>
  );
}
 
// --------------------------------------------------------------- Programs
function ProgramsAdmin() {

  const [programs, setPrograms] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
      title: "",
      description: "",
      link: ""
    });

 
    const loadPrograms = async () => {
        try {
          const response = await getAllPrograms();
          setPrograms(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };
	  useEffect(() => {
	    loadPrograms();
	  }, []);

	  const addProgram = async (e) => {
	    e.preventDefault();
	    try {
	      if (editing) {
	        await updateProgramById(
	          editing.id,
	          form
	        );
	      } else {
	        await createProgram(
	          form
	        );
	      }
	      await loadPrograms();
	      setEditing(null);
	      setForm({
	        title: "",
	        description: "",
	        link: ""
	      });
	    } catch (error) {
	      console.error(error);
	    }
	  };
	
	const openEdit = (program) => {
	  setEditing(program);
	  setForm({
	    title: program.title,
	    description: program.description,
	    link: program.link
	  });
	};

  return (
    <section className="card section-card">
      <SectionHeading title="Programs" note={`${programs.length} programs`}/>
      <div className="admin-table">
        {programs.map((p) => (
          <div
            className="admin-row stacked"
            key={p.id}
          >
            <p>
              <strong>
                {p.title}
              </strong>
            </p>
            <p>
              {p.description}
            </p>
            <p>
              {p.link}
            </p>
			<div className="admin-row-actions">

			  <button
			    className="btn btn-secondary"
			    onClick={() =>
			      openEdit(p)
			    }
			  >
			    Edit
			  </button>

			  <button
			    className="btn-ghost danger"
			    onClick={async () => {

			      await deleteProgramById(
			        p.id
			      );

			      await loadPrograms();

			    }}
			  >
			    Remove
			  </button>

			</div>
          </div>
        ))}
      </div>
	  
      <form className="inline-add-form stacked" onSubmit={addProgram}>

        <input placeholder="Program Title" value={form.title} onChange={(e) =>
            setForm({...form, title: e.target.value})
          }
        />

        <textarea
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <input
          placeholder="Resource Link"
          value={form.link}
          onChange={(e) =>
            setForm({
              ...form,
              link: e.target.value
            })
          }
        />

		<button type="submit" className="btn btn-primary">
		  {editing
		    ? "Update Program"
		    : "+ Add Program"}
		</button>

      </form>

    </section>

  );
}
 
function FormField({ label, value, onChange, type = "text", required = false }) {
  return (
    <>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}