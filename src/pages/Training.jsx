import { useState, useEffect } from "react";

import { usePortalData } from "../context/PortalDataContext.jsx";

import { PageHeader, SectionHeading } from "./Dashboard.jsx";

import {
    getIntroductionTrainings,
    getDomainTrainings,
    getFunctionalTrainings
} from "../services/trainingService";

import { getRecordedSessions } from "../services/recordedSessionService";

import {
    getInterviewCategories
} from "../services/interviewCategoryService";

import {
    getInterviewQuestions
} from "../services/interviewQuestionService";

import {
    getFaqs
} from "../services/faqService";

import {
    getInterviewExperiences,
    openInterviewExperienceDocument
} from "../services/interviewExperienceService";




const TABS = [
    {
        id: "intro",
        label: "Introduction to Account"
    },
    {
        id: "domain",
        label: "Domain Specific Training"
    },
    {
        id: "functional",
        label: "Technical Skill Training"
    },
    {
        id: "interview",
        label: "Interview Prep & FAQs"
    }
];


export default function Training() {

    const { data } = usePortalData();

    const [tab, setTab] = useState("intro");

    const [introTrainings, setIntroTrainings] = useState([]);

    const [domainTrainings, setDomainTrainings] = useState([]);

    const [functionalTrainings, setFunctionalTrainings] = useState([]);

    const [recordedSessions, setRecordedSessions] = useState({});


    // =====================================================
    // INTERVIEW DATA
    // =====================================================

    const [interviewCategories, setInterviewCategories] =
        useState([]);

    const [interviewQuestions, setInterviewQuestions] =
        useState([]);

    const [faqs, setFaqs] = useState([]);
	
	const [interviewExperiences, setInterviewExperiences] =
	    useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [interviewLoading, setInterviewLoading] =
        useState(false);

    const [interviewError, setInterviewError] =
        useState("");


    // =====================================================
    // LOAD TRAININGS
    // =====================================================

    useEffect(() => {

        const loadTrainings = async () => {

            try {

                const intro =
                    await getIntroductionTrainings();

                const domain =
                    await getDomainTrainings();

                const functional =
                    await getFunctionalTrainings();


                setIntroTrainings(
                    intro.data || []
                );

                setDomainTrainings(
                    domain.data || []
                );

                setFunctionalTrainings(
                    functional.data || []
                );

            } catch (error) {

                console.error(
                    "Error loading trainings:",
                    error
                );

            }

        };


        loadTrainings();

    }, []);


    // =====================================================
    // LOAD RECORDED SESSIONS
    // =====================================================

    useEffect(() => {

        const loadSessions = async () => {

            const sessions = {};


            for (
                const training
                of functionalTrainings
            ) {

                try {

                    const response =
                        await getRecordedSessions(
                            training.id
                        );


                    sessions[training.id] =
                        response.data || [];

                } catch (error) {

                    console.error(
                        error
                    );

                    sessions[training.id] = [];

                }

            }


            setRecordedSessions(
                sessions
            );

        };


        if (
            functionalTrainings.length > 0
        ) {

            loadSessions();

        }

    }, [functionalTrainings]);


    // =====================================================
    // LOAD INTERVIEW DATA
    // =====================================================

    useEffect(() => {

        const loadInterviewData = async () => {

            setInterviewLoading(true);

            setInterviewError("");


            try {

				const [
				    categoriesResponse,
				    questionsResponse,
				    faqsResponse,
				    experiencesResponse
				] = await Promise.all([
				    getInterviewCategories(),
				    getInterviewQuestions(),
				    getFaqs(),
				    getInterviewExperiences()
				]);


                setInterviewCategories(
                    categoriesResponse.data || []
                );

                setInterviewQuestions(
                    questionsResponse.data || []
                );

                setFaqs(
                    faqsResponse.data || []
                );
				
				setInterviewExperiences(
				    experiencesResponse.data || []
				);

            } catch (error) {

                console.error(
                    "Error loading interview data:",
                    error
                );

                setInterviewError(
                    "Unable to load interview questions and FAQs."
                );

            } finally {

                setInterviewLoading(false);

            }

        };


        loadInterviewData();

    }, []);


    // =====================================================
    // FILTER QUESTIONS
    // =====================================================

    const filteredQuestions =
        selectedCategory === "ALL"
            ? interviewQuestions
            : interviewQuestions.filter(
                (question) =>
                    String(question.categoryId) ===
                    String(selectedCategory)
            );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="page">

            <PageHeader
                eyebrow="Learning"
                title="Training Section"
                subtitle="From account fundamentals to client-interview readiness."
            />


            {/* =================================================
                TABS
            ================================================= */}

            <div
                className="pill-tabs"
                role="tablist"
            >

                {TABS.map((t) => (

                    <button
                        key={t.id}
                        role="tab"
                        aria-selected={
                            tab === t.id
                        }
                        className={
                            `pill-tab ${
                                tab === t.id
                                    ? "active"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setTab(t.id)
                        }
                    >
                        {t.label}
                    </button>

                ))}

            </div>


            {/* =================================================
                INTRODUCTION
            ================================================= */}

            {tab === "intro" && (

                <section className="card section-card">

                    <SectionHeading
                        title="Introduction to Account"
                        note="Start here"
                    />


                    <ul className="link-list">

                        {introTrainings.map(
                            (item) => (

                                <li key={item.id}>

                                    <a
                                        href={
                                            item.sharePointUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {item.title}
                                    </a>

                                </li>

                            )
                        )}

                    </ul>

                </section>

            )}


            {/* =================================================
                DOMAIN
            ================================================= */}

            {tab === "domain" && (

                <section className="card section-card">

                    <SectionHeading
                        title="Domain Specific Training"
                        note={
                            `${domainTrainings.length} tracks`
                        }
                    />


                    <div className="tile-grid">

                        {domainTrainings.map(
                            (d) => (

                                <a
                                    className="domain-tile"
                                    key={d.id}
                                    href={
                                        d.sharePointUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >

                                    <span>
                                        {d.title}
                                    </span>


                                    <span
                                        className="domain-tile-arrow"
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>

                                </a>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                FUNCTIONAL
            ================================================= */}

            {tab === "functional" && (

                <section className="card section-card">

                    <SectionHeading
                        title="Technical Skill Training"
                        note="Technologies and course materials"
                    />


                    <div className="functional-list">

                        {functionalTrainings.map(
                            (ft) => (

                                <div
                                    className="functional-item"
                                    key={ft.id}
                                >

                                    <div
                                        className="functional-item-head"
                                    >

                                        <h3>
                                            {ft.title}
                                        </h3>


                                        <a
                                            href={
                                                ft.sharePointUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Course Material →
                                        </a>

                                    </div>


                                    <p className="empty-note">
                                        {ft.description}
                                    </p>


                                    {(
                                        recordedSessions[
                                            ft.id
                                        ] || []
                                    ).length > 0 ? (

                                        <ul className="recording-list">

                                            {(
                                                recordedSessions[
                                                    ft.id
                                                ] || []
                                            ).map(
                                                (session) => (

                                                    <li
                                                        key={
                                                            session.id
                                                        }
                                                    >

                                                        <a
                                                            href={
                                                                session.recordingUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            ▶{" "}
                                                            {
                                                                session.title
                                                            }
                                                        </a>

                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    ) : (

                                        <p className="empty-note">
                                            No recorded sessions yet.
                                        </p>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                INTERVIEW PREP
            ================================================= */}

            {tab === "interview" && (

                <div>

                    {/* =========================================
                        INTERVIEW QUESTIONS
                    ========================================== */}

                    <section className="card section-card">

                        <SectionHeading
                            title="Interview Questions"
                            note={
                                `${filteredQuestions.length} questions`
                            }
                        />


                        {interviewLoading && (

                            <p className="empty-note">
                                Loading interview questions...
                            </p>

                        )}


                        {interviewError && (

                            <p className="empty-note">
                                {interviewError}
                            </p>

                        )}


                        {!interviewLoading &&
                            !interviewError && (

                                <>

                                    {/* =================================
                                        CATEGORY FILTER
                                    ================================== */}

                                    <div
                                        className="training-tech-filter"
                                    >

                                        <label>
                                            Technology
                                        </label>


                                        <select
                                            value={
                                                selectedCategory
                                            }
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="ALL">
                                                All Technologies
                                            </option>


                                            {interviewCategories.map(
                                                (category) => (

                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {
                                                            category.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* =================================
                                        QUESTIONS
                                    ================================== */}

                                    {filteredQuestions.length === 0 ? (

                                        <p className="empty-note">

                                            No interview questions
                                            available for this
                                            technology yet.

                                        </p>

                                    ) : (

                                        <div className="training-question-list">

                                            {filteredQuestions.map(
                                                (question) => {

                                                    const categoryName =
                                                        question.categoryName ||
                                                        getCategoryName(
                                                            question.categoryId,
                                                            interviewCategories
                                                        );


                                                    return (

                                                        <div
                                                            className="training-question-item"
                                                            key={
                                                                question.id
                                                            }
                                                        >

                                                            <span
                                                                className={
                                                                    `training-tech-badge ${
                                                                        getTrainingTechnologyClass(
                                                                            categoryName
                                                                        )
                                                                    }`
                                                                }
                                                            >
                                                                {
                                                                    categoryName
                                                                }
                                                            </span>


                                                            <span className="training-question-text">

                                                                {
                                                                    question.question
                                                                }

                                                            </span>

                                                        </div>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}

                                </>

                            )}

                    </section>
					
					{/* =========================================
					    INTERVIEWEE PERSONAL EXPERIENCE
					========================================== */}

					<section
					    className="card section-card"
					    style={{
					        marginTop: "24px"
					    }}
					>

					    <SectionHeading
					        title="Interviewee Personal Experience"
					        note={`${interviewExperiences.length} experiences`}
					    />

					    {interviewLoading ? (

					        <p className="empty-note">
					            Loading interview experiences...
					        </p>

					    ) : interviewExperiences.length === 0 ? (

					        <p className="empty-note">
					            No interviewee experiences available yet.
					        </p>

					    ) : (

					        <div className="training-question-list">

					            {interviewExperiences.map(
					                (experience) => {

					                    const categoryName =
					                        experience.categoryName ||
					                        getCategoryName(
					                            experience.categoryId,
					                            interviewCategories
					                        );

					                    return (

					                        <div
					                            className="training-question-item"
					                            key={experience.id}
					                            style={{
					                                alignItems: "center"
					                            }}
					                        >

					                            {/* TECHNOLOGY */}

					                            <span
					                                className={
					                                    `training-tech-badge ${
					                                        getTrainingTechnologyClass(
					                                            categoryName
					                                        )
					                                    }`
					                                }
					                            >
					                                {categoryName}
					                            </span>


					                            {/* NAME */}

					                            <span
					                                className="training-question-text"
					                                style={{
					                                    fontWeight: 600
					                                }}
					                            >
					                                {experience.intervieweeName}
					                            </span>


					                            {/* BUTTON */}

					                            {experience.documentName ? (

					                                <button
					                                    type="button"
					                                    className="interview-btn interview-edit-btn"
					                                    style={{
					                                        marginLeft: "auto",
					                                        flexShrink: 0
					                                    }}
					                                    onClick={async () => {

					                                        try {

					                                            await openInterviewExperienceDocument(
					                                                experience.id,
					                                                experience.documentName
					                                            );

					                                        } catch (error) {

					                                            console.error(
					                                                "Error downloading interview questions:",
					                                                error
					                                            );

					                                            alert(
					                                                "Unable to open the interview questions document."
					                                            );
					                                        }

					                                    }}
					                                >
					                                    Interview Questions
					                                </button>

					                            ) : (

					                                <span
					                                    style={{
					                                        marginLeft: "auto",
					                                        color: "var(--ink-faint)",
					                                        fontSize: "12px"
					                                    }}
					                                >
					                                    Questions document not available
					                                </span>

					                            )}

					                        </div>

					                    );

					                }
					            )}

					        </div>

					    )}

					</section>


                    {/* =========================================
                        FAQ
                    ========================================== */}

                    <section
                        className="card section-card"
                        style={{
                            marginTop: "24px"
                        }}
                    >

                        <SectionHeading
                            title="FAQs"
                            note={
                                `${faqs.length} FAQs`
                            }
                        />


                        {interviewLoading ? (

                            <p className="empty-note">
                                Loading FAQs...
                            </p>

                        ) : faqs.length === 0 ? (

                            <p className="empty-note">
                                No FAQs available yet.
                            </p>

                        ) : (

                            <div className="training-faq-list">

                                {faqs.map(
                                    (faq) => (

                                        <details
                                            className="training-faq-item"
                                            key={faq.id}
                                        >

                                            <summary>
                                                {faq.question}
                                            </summary>


                                            <p className="training-faq-answer">
                                                {faq.answer}
                                            </p>

                                        </details>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            )}

        </div>

    );
}


// =========================================================
// GET CATEGORY NAME
// =========================================================

function getCategoryName(
    categoryId,
    categories
) {

    const category =
        categories.find(
            (item) =>
                Number(item.id) ===
                Number(categoryId)
        );


    return category
        ? category.name
        : "Unknown Technology";
}


// =========================================================
// TRAINING TECHNOLOGY COLORS
// =========================================================

function getTrainingTechnologyClass(
    categoryName
) {

    if (!categoryName) {
        return "training-tech-default";
    }


    const name =
        categoryName
            .toLowerCase()
            .trim();


    if (name === "java") {
        return "training-tech-java";
    }


    if (name === "mainframe") {
        return "training-tech-mainframe";
    }


    if (name === ".net fsd") {
        return "training-tech-net-fsd";
    }


    if (name === "fsd") {
        return "training-tech-fsd";
    }


    if (name === "testing") {
        return "training-tech-testing";
    }


    if (
        name === "frontend dev" ||
        name === "frontend development"
    ) {
        return "training-tech-frontend";
    }


    if (
        name === "backend dev" ||
        name === "backend development"
    ) {
        return "training-tech-backend";
    }


    if (name === "data engineering") {
        return "training-tech-data-engineering";
    }


    return "training-tech-default";
}