import { useState, useEffect } from "react";
//import { usePortalData } from "../context/PortalDataContext.jsx";
//import { useAuth } from "../context/AuthContext.jsx";
import { exportAllData } from "../data/mockData.js";
import { PageHeader, SectionHeading } from "./Dashboard.jsx";
import Modal from "../components/Modal.jsx";
import {createPOC,updatePOCById,deletePOCById,getAllPOCs} from "../services/adminPocService";
import {getAssignedEmployees,assignEmployeeToPoc,removeEmployeeFromPoc} from "../services/pocAssignmentService";
import { getAllUsers } from "../services/userService";
import {createOnboardingFile,updateOnboardingFileById,deleteOnboardingFileById} from "../services/adminOnboardingFileService";
import {getOnboardingFiles } from "../services/onboardingFileService";
import {createMandatoryTraining,updateMandatoryTrainingById,deleteMandatoryTrainingById} from "../services/adminMandatoryTrainingService"; 
import {createRecordedSession, deleteRecordedSession, getRecordedSessions} from "../services/recordedSessionService";
import {getFunctionalTrainings} from "../services/trainingService";
import {getAllTrainings, createTraining, updateTrainingById, deleteTrainingById} from "../services/adminTrainingService";
import {getAllPrograms, createProgram, updateProgramById, deleteProgramById} from "../services/adminProgramService";
import {getMandatoryTrainings} from "../services/mandatoryTrainingService";
import {getAllUsers as getAdminUsers, getUserById, createUser, updateUserById, deleteUserById} from "../services/adminUserService";
import {getProgramResources, createProgramResource, updateProgramResource, deleteProgramResource} from "../services/programResourceService";
import InterviewPrepAdmin from "../components/admin/InterviewPrepAdmin.jsx";

const TABS = [
  { id: "users", label: "Manage Users" },
  { id: "poc", label: "Points of Contact" },
  { id: "files", label: "Onboarding Files" },
  { id: "onboarding", label: "Mandatory Trainings" },
  { id: "training", label: "Training Management" },
  { id: "sessions", label: "Recorded Sessions" },
  { id: "prep", label: "Interview Prep & FAQs" },
  { id: "programs", label: "Programs" },
  { id: "programResources", label: "Program Resources"
  }
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
	  {tab === "programResources" && <ProgramResourceAdmin />}
    </div>
  );
}
 
// -------------------------------------------------------------- Users ----
function UsersAdmin() {

  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(null);

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      username: "",
      password: "",
      role: "USER"
    });

  const loadUsers = async () => {
    try {
      const response = await getAdminUsers();
      setUsers(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = async (user) => {
    try {
      const response = await getUserById(user.id);
      const fullUser = response;
      setEditing(fullUser);
      setForm({
        fullName: fullUser.fullName,
        email: fullUser.email,
        username: fullUser.username,
        password: "",
        role: fullUser.role
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({
      fullName: "",
      email: "",
      username: "",
      password: "",
      role: "USER"
    });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateUserById(
          editing.id,
          {
            fullName: form.fullName,
            email: form.email,
            username: form.username,
            role: form.role
          }
        );
      } else {
        await createUser({
          fullName: form.fullName,
          email: form.email,
          username: form.username,
          password: form.password
        });
      }
      await loadUsers();
      cancelEdit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="card section-card">
      <SectionHeading
        title="Manage Users"
        note={`${users.length} accounts`}
      />

      <div className="admin-table">
        {users.map((u) => (
          <div
            className="admin-row stacked"
            key={u.id}
          >
            <p>
              <strong>
                {u.name}
              </strong>
            </p>

			<p>
			  {u.email} · {u.username} · {u.role}
			</p>
			
            <div className="admin-row-actions">

              <button className="btn btn-secondary" onClick={() => openEdit(u)}>
                Edit
              </button>

              <button
                className="btn-ghost danger"
                onClick={async () => {
                  await deleteUserById(u.id);
                  await loadUsers();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading
        title={
          editing
            ? "Edit User"
            : "Add a new user"
        }
      />

      <form
        className="inline-add-form stacked"
        onSubmit={save}
      >

        <input
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) =>
            setForm({
              ...form,
              fullName:
                e.target.value
            })
          }
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value
            })
          }
        />

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value
            })
          }
        />

        {!editing && (

          <input
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value
              })
            }
          />
        )}

        {editing && (
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value
              })
            }
          >
            <option value="USER">
              USER
            </option>
            <option value="ADMIN">
              ADMIN
            </option>
          </select>
        )}

        <button type="submit" className="btn btn-primary">
          {editing
            ? "Update User"
            : "+ Add User"}
        </button>

        {editing && (
          <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>
    </section>
  );
}
// ---------------------------------------------------------------- POC ----
function PocAdmin() {
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
        const response =
          await getAssignedEmployees(
            pocId
          );
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
      <SectionHeading title="Point of Contact" note={`${allPocs.length} listed`} />
	  <div className="admin-table">
	    {allPocs.map((p) => (
	      <div className="admin-row" key={p.id}>
	        <div>
	          <p className="poc-name">{p.name}</p>
	          <p className="poc-role">{p.designation} · {p.email}</p>
	          <div className="assigned-employees">
	            <strong>Assigned Employees: </strong>
				<ul>
				  {(employees[p.id] || []).map((emp) => (
					<li
					  key={emp.userId}
					  className="assigned-employee-item"
					>
					  <span className="employee-name">
					    • {emp.name}
					  </span>

					  <button
					    className="employee-remove"
					    onClick={async () => {

					      await removeEmployeeFromPoc(
					        emp.userId,
					        p.id
					      );

					      await loadPocs();

					    }}
					  >
					    ✕
					  </button>
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
		  {users.filter(user => !(employees[assigningPoc?.id] || []).some(emp => emp.userId === user.id))
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
		cancelEdit();
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

 
// --------------------------------------------------------------- Programs
function ProgramsAdmin() {

  const [programs, setPrograms] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
      title: "",
      description: "",
      link: "",
	  category: "PROGRAM"
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
	        link: "",
			category: "PROGRAM"
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
	    link: program.link,
		category: program.category
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
		
		<select value={form.category} onChange={(e) =>
			setForm({...form, category: e.target.value})
				  }
		>
				  <option value="PROGRAM">
				    PROGRAM
				  </option>

				  <option value="BNY_DEMO">
				    BNY DEMO
				  </option>
		</select>

		<button type="submit" className="btn btn-primary">
		  {editing
		    ? "Update Program"
		    : "+ Add Program"}
		</button>

      </form>

    </section>

  );
}
 
// --------------------------------------------------------------- Programs Resources
function ProgramResourceAdmin() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [resources, setResources] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] =
    useState({
      name: "",
      type: "FOLDER",
      url: "",
	  category: "PROGRAM"
    });

  const loadPrograms = async () => {
    try {
      const response = await getAllPrograms();
      setPrograms(response.data);
      if (response.data.length > 0 && !selectedProgramId) {
        setSelectedProgramId(
          response.data[0].id
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadResources = async (programId) => {
      try {
        const response = await getProgramResources(programId);
        setResources(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgramId) {
      loadResources(
        selectedProgramId
      );
    }
  }, [selectedProgramId]);

  const openEdit = (resource) => {
      setEditing(resource);
      setForm({
        name: resource.name,
        type: resource.type,
        url: resource.url
      });
    };

  const cancelEdit = () => {
      setEditing(null);
      setForm({
        name: "",
        type: "FOLDER",
        url: ""
      });
    };

  const save = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ...form,
          programId:
            Number(
              selectedProgramId
            )
        };

        if (editing) {
          await updateProgramResource(
            editing.id,
            payload
          );
        } else {
          await createProgramResource(
            payload
          );
        }
        await loadResources(selectedProgramId);
        cancelEdit();
      } catch (error) {
        console.error(error);
      }
    };
	
	const getResourceIcon = (resource) => {
	  if (resource.type === "FOLDER") {
	    return "📁";
	  }
	  const lower = resource.name.toLowerCase();
	  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
	    return "📊";
	  }
	  if (lower.endsWith(".pptx") || lower.endsWith(".ppt")) {
	    return "📑";
	  }
	  if (lower.endsWith(".pdf")) {
	    return "📕";
	  }
	  if (lower.endsWith(".docx") || lower.endsWith(".doc")) {
	    return "📝";
	  }
	  if (lower.endsWith(".zip") || lower.endsWith(".rar")) {
	  	return "🗜️";
	  }
	  if (lower.endsWith(".mp4") || lower.endsWith(".mov")) {
	  	return "🎥";
	  }
	  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) {
	  	return "🖼️";
	  }
	  return "📄";
	};

  return (
    <section className="card section-card">
      <SectionHeading title="Program Resources" note={`${resources.length} resources`}/>
	  
      <label className="field-label">
        Program
      </label>

      <select value={selectedProgramId} onChange={(e) =>
          setSelectedProgramId(
            e.target.value
          )
        }
      >
        {programs.map((program) => (
          <option key={program.id} value={program.id}>
            {program.title}
          </option>
        ))}
      </select>

      <div className="admin-table">
        {resources.map((resource) => (
          <div className="admin-row stacked" key={resource.id}>

		  <p>
		    <strong>
		      {getResourceIcon(resource)}
		      {" "}
		      {resource.name}
		    </strong>
		  </p>

            <p>
              {resource.url}
            </p>

            <div className="admin-row-actions">

              <button className="btn btn-secondary" onClick={() =>
                  openEdit(
                    resource
                  )
                }
              >
                Edit
              </button>

              <button className="btn-ghost danger" onClick={async () => {

                  await deleteProgramResource(
                    resource.id
                  );

                  await loadResources(
                    selectedProgramId
                  );

                }}
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      <form className="inline-add-form stacked" onSubmit={save}>

        <input placeholder="Resource Name" value={form.name} onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value
            })
          }
        />

        <select value={form.type} onChange={(e) =>
            setForm({
              ...form,
              type:
                e.target.value
            })
          }
        >
          <option value="FOLDER">
            FOLDER
          </option>

          <option value="FILE">
            FILE
          </option>
        </select>

        <input
          placeholder="SharePoint URL"
          value={form.url}
          onChange={(e) =>
            setForm({
              ...form,
              url:
                e.target.value
            })
          }
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          {editing
            ? "Update Resource"
            : "+ Add Resource"}
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