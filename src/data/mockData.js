
const STORAGE_KEY = "bny_portal_state";
 
const USERS_STORAGE_KEY = "bny_portal_users";
 
// Bootstrap account only — this is the one login needed to sign in as
// Admin and add every other real user from Admin > Manage Users. Change
// this password immediately in a real deployment; it's plaintext here
// only because this draft has no backend/auth server yet.
export const seedUsers = [
  {
    id: "u-9001",
    employeeId: "BNY-ADMIN-01",
    name: "Portal Admin",
    email: "admin@bny.com",
    password: "ChangeMe@123",
    role: "admin",
    track: null,
    domain: null,
    joinedOn: new Date().toISOString().slice(0, 10),
  },
];
 
const seedState = {
  poc: [
    {
      id: "poc-1",
      name: "Divya Shankar",
      role: "Onboarding Buddy",
      email: "divya.shankar@bny.com",
      phone: "+91 98765 43210",
      slack: "@divya.shankar",
    },
    {
      id: "poc-2",
      name: "Rahul Verma",
      role: "Delivery Manager",
      email: "rahul.verma@bny.com",
      phone: "+91 91234 56780",
      slack: "@rahul.verma",
    },
  ],
 
  onboardingFiles: [
    { id: "of-1", title: "BNYM Dos & Don'ts", link: "" },
    { id: "of-2", title: "BNYM Delivery Org", link: "" },
    { id: "of-3", title: "Laptop Request Form", link: "" },
    { id: "of-4", title: "Laptop Request Helpcard", link: "" },
    { id: "of-5", title: "New Joiner Checklist — BNYM Account", link: "" },
    { id: "of-6", title: "Quick Links", link: "" },
    { id: "of-7", title: "WFH Attestation Helpcard", link: "" },
  ],
 
  mandatoryTrainings: [
    { id: "mt-1", title: "Code of Conduct & Ethics", link: "https://training.bny.example/code-of-conduct", status: "Not Started" },
    { id: "mt-2", title: "Information Security Fundamentals", link: "https://training.bny.example/infosec-101", status: "Not Started" },
    { id: "mt-3", title: "POSH Awareness", link: "https://training.bny.example/posh", status: "Not Started" },
    { id: "mt-4", title: "Data Privacy & Client Confidentiality", link: "https://training.bny.example/data-privacy", status: "Not Started" },
  ],
 
  // ---- Training Section ----
  introToAccount: [
    { id: "ia-1", title: "About BNY", link: "https://www.bny.com/corporate/global/en/about-us/about-bny.html" },
  ],
 
  domainTrainings: [
    { id: "dt-1", name: "Java FSD", link: "https://training.bny.example/domain/java-fsd" },
    { id: "dt-2", name: "Mainframe", link: "https://training.bny.example/domain/mainframe" },
    { id: "dt-3", name: ".Net FSD", link: "https://training.bny.example/domain/dotnet-fsd" },
    { id: "dt-4", name: "Testing", link: "https://training.bny.example/domain/testing" },
    { id: "dt-5", name: "FSD", link: "https://training.bny.example/domain/fsd" },
    { id: "dt-6", name: "Frontend Dev", link: "https://training.bny.example/domain/frontend" },
    { id: "dt-7", name: "Backend Dev", link: "https://training.bny.example/domain/backend" },
    { id: "dt-8", name: "Data Engineering", link: "https://training.bny.example/domain/data-engineering" },
  ],
 
  functionalTrainings: [
    { id: "ft-1", tech: "Angular", link: "https://training.bny.example/tech/angular", recordings: [
      { id: "rec-1", title: "Angular Basics — Session 1", url: "https://recordings.bny.example/angular-1" },
    ]},
    { id: "ft-2", tech: "React", link: "https://training.bny.example/tech/react", recordings: [
      { id: "rec-2", title: "React Fundamentals — Session 1", url: "https://recordings.bny.example/react-1" },
    ]},
    { id: "ft-3", tech: "Power BI", link: "https://training.bny.example/tech/power-bi", recordings: [] },
    { id: "ft-4", tech: "Snowflake", link: "https://training.bny.example/tech/snowflake", recordings: [] },
  ],
 
  interviewPrep: {
    questions: [
      { id: "iq-1", q: "Walk me through a project where you owned a feature end-to-end.", tag: "General" },
      { id: "iq-2", q: "Explain the difference between an interface and an abstract class.", tag: "Java" },
      { id: "iq-3", q: "How would you optimize a slow SQL query?", tag: "Data" },
    ],
    faqs: [
      { id: "faq-1", q: "How do I request a mock interview?", a: "Message your Point of Contact at least 3 working days in advance." },
      { id: "faq-2", q: "Where can I find past client interview patterns?", a: "Check the Domain Specific Training page for your track — sample rounds are linked there." },
    ],
  },
 
  // ---- Programs Section ----
  programs: [
    {
      id: "prog-elevate",
      name: "Elevate",
      tagline: "Structured growth track for early-career associates",
      description: "Elevate pairs you with a mentor and a quarterly skill roadmap to help you move from fresher to independently client-ready.",
      status: "Enrolling",
      resourceLink: "https://mphasis.sharepoint.com/:f:/s/BNYMOps/IgCb0dPUchNlRoTsk6nQF8b8Adm-Iko-mSn6-G1VrVxXlew?e=5anwp3",
    },
    {
      id: "prog-forge",
      name: "Forge",
      tagline: "Deep-dive specialization track for experienced engineers",
      description: "Forge is a cohort-based program for experienced hires to build depth in a chosen specialization alongside senior architects.",
      status: "Enrolling",
      resourceLink: "https://mphasis.sharepoint.com/:f:/s/BNYMOps/IgC36Kd-mLG_Rr-OBvxzhVKTAVFrzLnGXQkywq1wSdbLqq8?e=u8JYle",
    },
  ],
};
 
export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) return saved;
    }
  } catch (e) {
    console.warn("Could not read saved users, falling back to the bootstrap account.", e);
  }
  return structuredClone(seedUsers);
}
 
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Could not persist users.", e);
  }
}
 
export function resetUsers() {
  localStorage.removeItem(USERS_STORAGE_KEY);
  return structuredClone(seedUsers);
}
 
/**
 * Bundles every user + portal-content record into one downloadable JSON
 * file, shaped for handing off to a real database import — one array
 * per eventual table, each record keeping the same field names already
 * used in this app. Passwords are excluded; a real backend must hash
 * them itself rather than importing plaintext.
 */
export function exportAllData() {
  const users = loadUsers().map(({ password, ...rest }) => rest);
  const portalData = loadState();
 
  const payload = {
    exportedAt: new Date().toISOString(),
    note: "Passwords are intentionally omitted — set/hash them directly in the real database.",
    tables: {
      users,
      poc: portalData.poc,
      onboardingFiles: portalData.onboardingFiles,
      mandatoryTrainings: portalData.mandatoryTrainings,
      introToAccount: portalData.introToAccount,
      domainTrainings: portalData.domainTrainings,
      functionalTrainings: portalData.functionalTrainings,
      interviewQuestions: portalData.interviewPrep.questions,
      faqs: portalData.interviewPrep.faqs,
      programs: portalData.programs,
    },
  };
 
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bny-university-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
 
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Merge onto a fresh copy of the seed shape — protects against
      // crashes when a browser's cached state predates a newly added
      // field (e.g. an older session saved before "onboardingFiles"
      // existed would otherwise come back with that key missing).
      return { ...structuredClone(seedState), ...saved };
    }
  } catch (e) {
    console.warn("Could not read saved state, falling back to seed data.", e);
  }
  return structuredClone(seedState);
}
 
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not persist state.", e);
  }
}
 
export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(seedState);
}