import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loadState, saveState } from "../data/mockData";
 
const PortalDataContext = createContext(null);
 
export function PortalDataProvider({ children }) {
  const [data, setData] = useState(() => loadState());
 
  useEffect(() => {
    saveState(data);
  }, [data]);
 
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
 
  const updateMandatoryTrainingStatus = useCallback((trainingId, status) => {
    setData((prev) => ({
      ...prev,
      mandatoryTrainings: prev.mandatoryTrainings.map((t) =>
        t.id === trainingId ? { ...t, status } : t
      ),
    }));
  }, []);
 
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