import { useState, useEffect } from "react";
import { PageHeader } from "./Dashboard.jsx";
import { getProgramsByCategory } from "../services/programService";
import { getProgramResources } from "../services/programResourceService";

export default function Programs() {
	const [programs,setPrograms] = useState([]);
	const [selectedProgram,setSelectedProgram] = useState(null);
	const [resources,setResources] = useState([]);
	
	

	  const loadPrograms = async () => {
	      try {
	        const response = await getProgramsByCategory("PROGRAM");
	        console.log("Programs",response);
	        setPrograms(response.data);
	      } catch (error) {
	        console.error(error);
	      }
	    };
		useEffect(() => {
		  loadPrograms();
		}, []);
	
	const openProgram =
	  async (program) => {
	    try {
	      const response =
	        await getProgramResources(
	          program.id
	        );
	      setResources(
	        response.data
	      );
	      setSelectedProgram(
	        program
	      );
	    } catch (error) {
	      console.error(error);
	    }
	};
	
	const folders = resources
	  .filter(
	    resource =>
	      resource.type === "FOLDER"
	  )
	  .sort((a, b) =>
	    a.name.localeCompare(b.name)
	  );

	const files = resources.filter(
	    resource =>
	      resource.type === "FILE"
	  )
	  .sort((a, b) =>
	    a.name.localeCompare(b.name)
	  );

	  const getFileIcon = (name) => {
	    const lowerName = name.toLowerCase();
	    if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
	      return "📊";
	    }
	    if (lowerName.endsWith(".pptx") || lowerName.endsWith(".ppt")) {
	      return "📑";
	    }
	    if (lowerName.endsWith(".pdf")) {
	      return "📕";
	    }
	    if (lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) {
	      return "📝";
	    }
	    if (lowerName.endsWith(".zip") || lowerName.endsWith(".rar")) {
	      return "🗜️";
	    }
	    if (lowerName.endsWith(".mp4") || lowerName.endsWith(".mov")) {
	      return "🎥";
	    }
	    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".png")) {
	      return "🖼️";
	    }
	    return "📄";
	  };
	  
  return (
    <div className="page">
      <PageHeader
        eyebrow="Grow"
        title="Programs"
        subtitle="Structured tracks available on your current account."
      />
 
	  <div className="program-grid">
	    {programs.map((p) => (
			<div className="program-card" key={p.id}>

			  <div className="program-card-top">
			    <h2>{p.title}</h2>
			  </div>

			  <p className="program-description">
			    {p.description}
			  </p>
			  <button className="btn btn-secondary" onClick={() => openProgram(p)}>
			    View Contents
			  </button>

			</div>
	    ))}
	  </div>
	  {selectedProgram && (

	    <section
	      className="card section-card"
	    >

	      <h3>
	        {selectedProgram.title}
	      </h3>
		  
		
		  {folders.length > 0 && (
		    <>
		      <h4>Folders</h4>

		      <div className="resource-list">

		        {folders.map((resource) => (

		          <div
		            key={resource.id}
		            className="resource-row"
		            onClick={() =>
		              window.open(
		                resource.url,
		                "_blank"
		              )
		            }
		          >

		            <span className="resource-icon">
		              📁
		            </span>

		            <span>
		              {resource.name}
		            </span>

		          </div>

		        ))}

		      </div>
		    </>
		  )}

		  {files.length > 0 && (
		    <>
		      <h4
		        style={{
		          marginTop: "24px"
		        }}
		      >
		        Files
		      </h4>

		      <div className="resource-list">

		        {files.map((resource) => (

		          <div
		            key={resource.id}
		            className="resource-row"
		            onClick={() =>
		              window.open(
		                resource.url,
		                "_blank"
		              )
		            }
		          >

		            <span className="resource-icon">
		              {getFileIcon(resource.name)}
		            </span>

		            <span>
		              {resource.name}
		            </span>

		          </div>

		        ))}

		      </div>
		    </>
		  )}

	    </section>

	  )}
    </div>
	
  );
 }