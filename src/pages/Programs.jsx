import { useState, useEffect } from "react";
import { PageHeader } from "./Dashboard.jsx";
import { getPrograms } from "../services/programService";

export default function Programs() {
	const [programs,setPrograms] = useState([]);
	
	useEffect(() => {

	  const loadPrograms = async () => {
	      try {
	        const response = await getPrograms();
	        console.log("Programs",response);
	        setPrograms(response.data);
	      } catch (error) {
	        console.error(error);
	      }
	    };
	  loadPrograms();
	}, []);
 
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
			  {p.link ? <a href={p.link}> View resources ↗ </a>  : (
			    <p className="empty-note program-resource-empty">
			      Resources not added yet.
			    </p>
			  )}

			</div>
	    ))}
	  </div>
    </div>
  );
 }