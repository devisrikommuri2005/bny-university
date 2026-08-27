import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loadState, saveState } from "../data/mockData";
import { getPOCs } from "../services/pocService";
import { getMandatoryTrainings } from "../services/mandatoryTrainingService";
import { getOnboardingFiles } from "../services/onboardingFileService";
import {updateTrainingStatus,getTrainingStatuses} from "../services/mandatoryTrainingStatusService";
  
const PortalDataContext = createContext(null);
 
export function PortalDataProvider({ children }) {
	const [data, setData] = useState({
	  poc: [],
	  onboardingFiles: [],
	  mandatoryTrainings: [],
	  introToAccount: [],
	  domainTrainings: [],
	  functionalTrainings: [],
	  interviewPrep: {
	    questions: [],
	    faqs: []
	  },
	  programs: []
	});
 
  useEffect(() => {
    const fetchPOCs = async () => {
      try {
		const response = await getPOCs();
		console.log(
		"POC Response",
		response
		);
		setData(prev => ({
		    ...prev,
		    poc: response.data.map(p => ({
		        id: p.id,
		        name: p.name,
		        role: p.designation,
		        email: p.email,
		        phone: p.phoneNumber
		    }))
		}));
      } catch (error) {
        console.error(
          "Failed to fetch POCs",
          error
        );
      }
    };
    fetchPOCs();
  }, []);
  
  
  
  useEffect(() => {

    const fetchMandatoryTrainings =
      async () => {

        try {

			const trainingsResponse =
			    await getMandatoryTrainings();

			const statusesResponse =
			    await getTrainingStatuses();

			const statuses =
			    statusesResponse.data;

			console.log(
			    "Mandatory Trainings:",
			    trainingsResponse
			);

			setData(prev => ({
			  ...prev,

			  mandatoryTrainings:
			    trainingsResponse.data.map(t => {

			      const match =
			        statuses.find(
			          s => s.trainingId === t.id
			        );

			      return {

			        id: t.id,

			        title: t.title,

			        link: t.sharePointUrl,

			        status:
			          match?.status === "COMPLETED"
			            ? "Completed"
			            : match?.status === "IN_PROGRESS"
			            ? "In Progress"
			            : "Not Started"
			      };
			    })
			}));

        } catch (error) {

          console.error(
            "Failed to fetch mandatory trainings",
            error
          );
        }
      };

    fetchMandatoryTrainings();

  }, []);
 
 

    const fetchOnboardingFiles =
      async () => {

        try {

          const response =
            await getOnboardingFiles();
			
			

          setData(prev => ({
            ...prev,

            onboardingFiles:
              response.data.map(file => ({

                id: file.id,

                title: file.title,

                link: file.sharePointUrl
              }))
          }));
		  

        } catch (error) {

          console.error(
            "Failed to fetch onboarding files",
            error
          );
        }
      };
	  useEffect(() => {
	    fetchOnboardingFiles();
	  }, []);
  
  const updatePOC = useCallback((pocId, fields) => {
    setData((prev) => ({
      ...prev,
      poc: prev.poc.map((p) => (p.id === pocId ? { ...p, ...fields } : p)),
    }));
  }, []);
 
  const addPOC = useCallback((newPoc) => {
    setData((prev) => ({
      ...prev,
      poc: [...prev.poc, { id: `poc-${Date.now()}`, ...newPoc }],
    }));
  }, []);
 
  const removePOC = useCallback((pocId) => {
    setData((prev) => ({ ...prev, poc: prev.poc.filter((p) => p.id !== pocId) }));
  }, []);
 
  const addRecording = useCallback((functionalTrainingId, recording) => {
    setData((prev) => ({
      ...prev,
      functionalTrainings: prev.functionalTrainings.map((ft) =>
        ft.id === functionalTrainingId
          ? { ...ft, recordings: [...ft.recordings, { id: `rec-${Date.now()}`, ...recording }] }
          : ft
      ),
    }));
  }, []);
 
  const removeRecording = useCallback((functionalTrainingId, recordingId) => {
    setData((prev) => ({
      ...prev,
      functionalTrainings: prev.functionalTrainings.map((ft) =>
        ft.id === functionalTrainingId
          ? { ...ft, recordings: ft.recordings.filter((r) => r.id !== recordingId) }
          : ft
      ),
    }));
  }, []);
 
  const updateMandatoryTrainingStatus =
    useCallback(
      async (trainingId, status) => {

        try {

          await updateTrainingStatus(
            trainingId,
            status.toUpperCase().replaceAll(" ", "_")
          );

          setData((prev) => ({
            ...prev,
            mandatoryTrainings:
              prev.mandatoryTrainings.map((t) =>
                t.id === trainingId
                  ? { ...t, status }
                  : t
              ),
          }));

        } catch (error) {

          console.error(
            "Failed to update status",
            error
          );
        }
      },
      []
    );
 
  const addMandatoryTraining = useCallback((training) => {
    setData((prev) => ({
      ...prev,
      mandatoryTrainings: [
        ...prev.mandatoryTrainings,
        { id: `mt-${Date.now()}`, status: "Not Started", ...training },
      ],
    }));
  }, []);
 
  const updateMandatoryTraining = useCallback((trainingId, fields) => {
    setData((prev) => ({
      ...prev,
      mandatoryTrainings: prev.mandatoryTrainings.map((t) =>
        t.id === trainingId ? { ...t, ...fields } : t
      ),
    }));
  }, []);
 
  const removeMandatoryTraining = useCallback((trainingId) => {
    setData((prev) => ({
      ...prev,
      mandatoryTrainings: prev.mandatoryTrainings.filter((t) => t.id !== trainingId),
    }));
  }, []);
 
  const addInterviewQuestion = useCallback((question) => {
    setData((prev) => ({
      ...prev,
      interviewPrep: {
        ...prev.interviewPrep,
        questions: [...prev.interviewPrep.questions, { id: `iq-${Date.now()}`, ...question }],
      },
    }));
  }, []);
 
  const addFaq = useCallback((faq) => {
    setData((prev) => ({
      ...prev,
      interviewPrep: {
        ...prev.interviewPrep,
        faqs: [...prev.interviewPrep.faqs, { id: `faq-${Date.now()}`, ...faq }],
      },
    }));
  }, []);
 
  const addOnboardingFile = useCallback((file) => {
    setData((prev) => ({
      ...prev,
      onboardingFiles: [...prev.onboardingFiles, { id: `of-${Date.now()}`, ...file }],
    }));
  }, []);
 
  const updateOnboardingFile = useCallback((fileId, fields) => {
    setData((prev) => ({
      ...prev,
      onboardingFiles: prev.onboardingFiles.map((f) => (f.id === fileId ? { ...f, ...fields } : f)),
    }));
  }, []);
 
  const removeOnboardingFile = useCallback((fileId) => {
    setData((prev) => ({
      ...prev,
      onboardingFiles: prev.onboardingFiles.filter((f) => f.id !== fileId),
    }));
  }, []);
 
  const updateProgram = useCallback((programId, fields) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === programId ? { ...p, ...fields } : p)),
    }));
  }, []);
 
  return (
    <PortalDataContext.Provider
      value={{
        data,
        updatePOC,
        addPOC,
        removePOC,
        addRecording,
        removeRecording,
        updateMandatoryTrainingStatus,
        addMandatoryTraining,
        updateMandatoryTraining,
        removeMandatoryTraining,
        addOnboardingFile,
        updateOnboardingFile,
        removeOnboardingFile,
        addInterviewQuestion,
        addFaq,
        updateProgram,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  );
}
 
export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}