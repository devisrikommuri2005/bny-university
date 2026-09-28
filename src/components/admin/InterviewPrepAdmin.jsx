import { useEffect, useState } from "react";





import {

    getInterviewCategories,

    createInterviewCategory

} from "../../services/interviewCategoryService";

import {

    getInterviewQuestions,

    createInterviewQuestion,

    updateInterviewQuestion,

    deleteInterviewQuestion

} from "../../services/interviewQuestionService";

import {

    getFaqs,

    createFaq,

    updateFaq,

    deleteFaq

} from "../../services/faqService";

import {
    getInterviewExperiences,
    createInterviewExperience,
    updateInterviewExperience,
    deleteInterviewExperience,
    uploadInterviewExperienceDocument,
    deleteInterviewExperienceDocument,
    openInterviewExperienceDocument
} from "../../services/interviewExperienceService";



export default function InterviewPrepAdmin() {

    // =====================================================

    // DATA

    // =====================================================



    const [categories, setCategories] = useState([]);

    const [questions, setQuestions] = useState([]);

    const [faqs, setFaqs] = useState([]);

    const [showTechnologyModal, setShowTechnologyModal] = useState(false);
    const [newTechnologyName, setNewTechnologyName] = useState("");
	
	// =====================================================
	// INTERVIEWEE PERSONAL EXPERIENCE
	// =====================================================

	const [experiences, setExperiences] = useState([]);

	const [experienceName, setExperienceName] = useState("");

	const [experienceCategoryId, setExperienceCategoryId] = useState("");

	const [experienceFile, setExperienceFile] = useState(null);

	const [experienceSaving, setExperienceSaving] = useState(false);



    // =====================================================

    // QUESTION FORM

    // =====================================================

    const [questionText, setQuestionText] = useState("");

    const [questionCategoryId, setQuestionCategoryId] = useState("");

    const [editingQuestionId, setEditingQuestionId] = useState(null);



    // =====================================================

    // QUESTION FILTER

    // =====================================================

    const [questionFilterCategory, setQuestionFilterCategory] =

        useState("ALL");



    // =====================================================

    // FAQ FORM

    // =====================================================

    const [faqQuestion, setFaqQuestion] = useState("");

    const [faqAnswer, setFaqAnswer] = useState("");

    const [editingFaqId, setEditingFaqId] = useState(null);



    // =====================================================

    // UI STATE

    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");



    // =====================================================

    // API RESPONSE HELPER

    // =====================================================

    const getArrayFromResponse = (response) => {

        if (Array.isArray(response)) {

            return response;

        }

        if (

            response &&

            Array.isArray(response.data)

        ) {

            return response.data;

        }

        return [];

    };



    // =====================================================

    // LOAD ALL DATA

    // =====================================================

    const loadData = async () => {

        setLoading(true);

        setError("");

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



            console.log(

                "Interview Categories:",

                categoriesResponse

            );

            console.log(

                "Interview Questions:",

                questionsResponse

            );

            console.log(

                "FAQs:",

                faqsResponse

            );



            setCategories(

                getArrayFromResponse(

                    categoriesResponse

                )

            );

            setQuestions(

                getArrayFromResponse(

                    questionsResponse

                )

            );

            setFaqs(

                getArrayFromResponse(

                    faqsResponse

                )

            );
			
			setExperiences(
			    getArrayFromResponse(
			        experiencesResponse
			    )
			);

        } catch (err) {

            console.error(

                "Error loading interview data:",

                err

            );

            setError(

                "Unable to load interview questions and FAQs."

            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        loadData();

    }, []);



    // =====================================================

    // FILTERED QUESTIONS

    // =====================================================

    const filteredQuestions =

        questionFilterCategory === "ALL"

            ? questions

            : questions.filter(

                (question) =>

                    String(question.categoryId) ===

                    String(questionFilterCategory)

            );



    // =====================================================

    // RESET QUESTION FORM

    // =====================================================

    const resetQuestionForm = () => {

        setQuestionText("");

        setQuestionCategoryId("");

        setEditingQuestionId(null);

    };



    // =====================================================

    // RESET FAQ FORM

    // =====================================================

    const resetFaqForm = () => {

        setFaqQuestion("");

        setFaqAnswer("");

        setEditingFaqId(null);

    };



    // =====================================================

    // ADD TECHNOLOGY

    // =====================================================

    const handleAddTechnology = () => {
        setNewTechnologyName("");
        setShowTechnologyModal(true);
    };

    const handleSaveTechnology = async () => {
        const trimmedName = newTechnologyName.trim();

        if (!trimmedName) return;

        const alreadyExists = categories.some(
            (category) =>
                category.name?.toLowerCase().trim() ===
                trimmedName.toLowerCase()
        );

        if (alreadyExists) {
            alert("This technology already exists.");
            return;
        }

        try {
            const response = await createInterviewCategory({
                name: trimmedName
            });

            const newCategory =
                response?.data && !Array.isArray(response.data)
                    ? response.data
                    : response;

            if (!newCategory?.id) {
                await loadData();
            } else {
                setCategories((previous) => [
                    ...previous,
                    newCategory
                ]);
                setQuestionCategoryId(String(newCategory.id));
            }

            setNewTechnologyName("");
            setShowTechnologyModal(false);
        } catch (err) {
            console.error("Error adding technology:", err);
            alert("Unable to add technology.");
        }
    };


    // =====================================================

    // SAVE QUESTION

    // =====================================================


    // =====================================================

    const handleSaveQuestion = async (event) => {

        event.preventDefault();



        if (!questionCategoryId) {

            alert(

                "Please select a technology."

            );

            return;

        }



        if (!questionText.trim()) {

            alert(

                "Please enter an interview question."

            );

            return;

        }



        setSaving(true);



        try {

            const payload = {

                categoryId:

                    Number(questionCategoryId),

                question:

                    questionText.trim()

            };



            if (editingQuestionId) {

                await updateInterviewQuestion(

                    editingQuestionId,

                    payload

                );

            } else {

                await createInterviewQuestion(

                    payload

                );

            }



            resetQuestionForm();

            await loadData();

        } catch (err) {

            console.error(

                "Error saving interview question:",

                err

            );

            alert(

                "Unable to save the interview question."

            );

        } finally {

            setSaving(false);

        }

    };



    // =====================================================

    // EDIT QUESTION

    // =====================================================

    const handleEditQuestion = (question) => {

        setEditingQuestionId(

            question.id

        );



        setQuestionCategoryId(

            String(

                question.categoryId ?? ""

            )

        );



        setQuestionText(

            question.question ?? ""

        );



        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };



    // =====================================================

    // DELETE QUESTION

    // =====================================================

    const handleDeleteQuestion = async (id) => {

        const confirmed =

            window.confirm(

                "Are you sure you want to delete this interview question?"

            );



        if (!confirmed) {

            return;

        }



        try {

            await deleteInterviewQuestion(id);

            await loadData();

        } catch (err) {

            console.error(

                "Error deleting interview question:",

                err

            );

            alert(

                "Unable to delete the interview question."

            );

        }

    };



    // =====================================================

    // SAVE FAQ

    // =====================================================

    const handleSaveFaq = async (event) => {

        event.preventDefault();



        if (!faqQuestion.trim()) {

            alert(

                "Please enter the FAQ question."

            );

            return;

        }



        if (!faqAnswer.trim()) {

            alert(

                "Please enter the FAQ answer."

            );

            return;

        }



        setSaving(true);



        try {

            const payload = {

                question:

                    faqQuestion.trim(),

                answer:

                    faqAnswer.trim()

            };



            if (editingFaqId) {

                await updateFaq(

                    editingFaqId,

                    payload

                );

            } else {

                await createFaq(

                    payload

                );

            }



            resetFaqForm();

            await loadData();

        } catch (err) {

            console.error(

                "Error saving FAQ:",

                err

            );

            alert(

                "Unable to save the FAQ."

            );

        } finally {

            setSaving(false);

        }

    };



    // =====================================================

    // EDIT FAQ

    // =====================================================

    const handleEditFaq = (faq) => {

        setEditingFaqId(

            faq.id

        );



        setFaqQuestion(

            faq.question ?? ""

        );



        setFaqAnswer(

            faq.answer ?? ""

        );



        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };



    // =====================================================

    // DELETE FAQ

    // =====================================================

    const handleDeleteFaq = async (id) => {

        const confirmed =

            window.confirm(

                "Are you sure you want to delete this FAQ?"

            );



        if (!confirmed) {

            return;

        }



        try {

            await deleteFaq(id);

            await loadData();

        } catch (err) {

            console.error(

                "Error deleting FAQ:",

                err

            );

            alert(

                "Unable to delete the FAQ."

            );

        }

    };
	
	// =====================================================
	// INTERVIEWEE PERSONAL EXPERIENCE
	// =====================================================

	const resetExperienceForm = () => {
	    setExperienceName("");
	    setExperienceCategoryId("");
	    setExperienceFile(null);
	};

	const handleSaveExperience = async (event) => {
	    event.preventDefault();

	    if (!experienceName.trim()) {
	        alert("Please enter the interviewee name.");
	        return;
	    }

	    if (!experienceCategoryId) {
	        alert("Please select a technology.");
	        return;
	    }

	    setExperienceSaving(true);

	    try {
	        const response = await createInterviewExperience({
	            intervieweeName: experienceName.trim(),
	            categoryId: experienceCategoryId
	        });

	        const createdExperience =
	            response?.data && !Array.isArray(response.data)
	                ? response.data
	                : response;

	        if (
	            experienceFile &&
	            createdExperience?.id
	        ) {
	            await uploadInterviewExperienceDocument(
	                createdExperience.id,
	                experienceFile
	            );
	        }

	        resetExperienceForm();

	        await loadData();

	        alert("Interview experience added successfully.");

	    } catch (err) {

	        console.error(
	            "Error saving interview experience:",
	            err
	        );

	        alert(
	            "Unable to save the interview experience."
	        );

	    } finally {

	        setExperienceSaving(false);
	    }
	};

	const handleReplaceExperienceDocument = async (
	    experience
	) => {

	    if (!experienceFile) {
	        alert("Please select a Word document first.");
	        return;
	    }

	    try {

	        setExperienceSaving(true);

	        await uploadInterviewExperienceDocument(
	            experience.id,
	            experienceFile
	        );

	        setExperienceFile(null);

	        await loadData();

	        alert(
	            "Interview questions document replaced successfully."
	        );

	    } catch (err) {

	        console.error(
	            "Error replacing document:",
	            err
	        );

	        alert(
	            "Unable to replace the document."
	        );

	    } finally {

	        setExperienceSaving(false);
	    }
	};

	const handleDeleteExperienceDocument = async (
	    id
	) => {

	    const confirmed = window.confirm(
	        "Are you sure you want to remove this interview questions document?"
	    );

	    if (!confirmed) {
	        return;
	    }

	    try {

	        await deleteInterviewExperienceDocument(id);

	        await loadData();

	    } catch (err) {

	        console.error(
	            "Error deleting experience document:",
	            err
	        );

	        alert(
	            "Unable to delete the document."
	        );
	    }
	};

	const handleDeleteExperience = async (id) => {

	    const confirmed = window.confirm(
	        "Are you sure you want to remove this interviewee experience?"
	    );

	    if (!confirmed) {
	        return;
	    }

	    try {

	        await deleteInterviewExperience(id);

	        await loadData();

	    } catch (err) {

	        console.error(
	            "Error deleting interview experience:",
	            err
	        );

	        alert(
	            "Unable to delete the interview experience."
	        );
	    }
	};

	const handleOpenExperienceDocument = async (
	    experience
	) => {

	    if (!experience.documentName) {
	        alert(
	            "Interview questions document is not available yet."
	        );
	        return;
	    }

	    try {

	        await downloadInterviewExperienceDocument(
	            experience.id,
	            experience.documentName
	        );

	    } catch (err) {

	        console.error(
	            "Error opening interview questions document:",
	            err
	        );

	        alert(
	            "Unable to open the interview questions document."
	        );
	    }
	};



    // =====================================================

    // LOADING

    // =====================================================

    if (loading) {

        return (

            <section className="card section-card">

                <p className="empty-note">

                    Loading Interview Prep & FAQs...

                </p>

            </section>

        );

    }



    // =====================================================

    // MAIN UI

    // =====================================================

    return (

        <section className="card section-card">

            <h2>

                Interview Prep & FAQs

            </h2>



            {error && (

                <p className="empty-note">

                    {error}

                </p>

            )}



            {/* =================================================

                INTERVIEW QUESTIONS

            \================================================= */}

            <div className="interview-prep-section">

                <div className="interview-section-header">

                    <h3>

                        Interview Questions

                    </h3>

                </div>



                {/* =============================================

                    QUESTION FORM

                \============================================== */}

                <form

                    onSubmit={handleSaveQuestion}

                    className="admin-form"

                >

                    <label>

                        Technology

                    </label>



                    <div

                        style={{

                            display: "flex",

                            gap: "10px",

                            alignItems: "stretch"
							
                        }}

                    >

                        <select

                            value={questionCategoryId}

                            onChange={(event) =>

                                setQuestionCategoryId(

                                    event.target.value

                                )

                            }

                            style={{

                                flex: 1

                            }}

                            required

                        >

                            <option value="">

                                Select Technology

                            </option>



                            {categories.map(

                                (category) => (

                                    <option

                                        key={category.id}

                                        value={category.id}

                                    >

                                        {category.name}

                                    </option>

                                )

                            )}

                        </select>



                        <button

                            type="button"

                            className="interview-submit-btn"

                            onClick={

                                handleAddTechnology

                            }

                        >

                            + Add Technology

                        </button>

                    </div>



                    <label>

                        Interview Question

                    </label>



                    <textarea

                        value={questionText}

                        onChange={(event) =>

                            setQuestionText(

                                event.target.value

                            )

                        }

                        placeholder="Enter interview question"

                        rows="3"

                        required

                    />



                    <div className="interview-form-actions">

                        <button

                            type="submit"

                            className="interview-submit-btn"

                            disabled={saving}

                        >

                            {saving

                                ? "Saving..."

                                : editingQuestionId

                                    ? "Update Question"

                                    : "Add Question"}

                        </button>



                        {editingQuestionId && (

                            <button

                                type="button"

                                className="interview-cancel-btn"

                                onClick={

                                    resetQuestionForm

                                }

                            >

                                Cancel

                            </button>

                        )}

                    </div>

                </form>



                {/* =============================================

                    FILTER

                \============================================== */}

                <div

                    className="training-tech-filter"

                    style={{

                        marginTop: "28px",
						marginBottom: "32px"

                    }}

                >

                    <label>

                        Filter by Technology

                    </label>



                    <div

                        style={{

                            display: "flex",

                            alignItems: "center",

                            gap: "12px"

                        }}

                    >

                        <select

                            value={

                                questionFilterCategory

                            }

                            onChange={(event) =>

                                setQuestionFilterCategory(

                                    event.target.value

                                )

                            }

                            style={{

                                flex: 1

                            }}

                        >

                            <option value="ALL">

                                All Technologies

                            </option>



                            {categories.map(

                                (category) => (

                                    <option

                                        key={category.id}

                                        value={category.id}

                                    >

                                        {category.name}

                                    </option>

                                )

                            )}

                        </select>



                        <span

                            className="interview-count"

                            style={{

                                whiteSpace: "nowrap",

                                flexShrink: 0

                            }}

                        >

                            {filteredQuestions.length} questions

                        </span>

                    </div>

                </div>



                {/* =============================================

                    QUESTION LIST

                \============================================== */}

                <div

                    style={{

                        marginTop: "28px",
						marginBottom: "32px"

                    }}

                >

                    {filteredQuestions.length === 0 ? (

                        <div className="interview-empty-state">

                            No interview questions found

                            for this technology.

                        </div>

                    ) : (

                        <div>

                            {filteredQuestions.map(

                                (question) => {

                                    const categoryName =

                                        question.categoryName ||

                                        getCategoryName(

                                            question.categoryId,

                                            categories

                                        );



                                    return (

                                        <div

                                            className="interview-question-card"

                                            key={question.id}

                                        >

                                            <div className="interview-question-content">

                                                <span

                                                    className={`tech-badge ${getTechnologyClass(

                                                        categoryName

                                                    )}`}

                                                >

                                                    {categoryName}

                                                </span>



                                                <p className="interview-question-text">

                                                    {

                                                        question.question

                                                    }

                                                </p>

                                            </div>



                                            <div className="interview-actions">

                                                <button

                                                    type="button"

                                                    className="interview-btn interview-edit-btn"

                                                    onClick={() =>

                                                        handleEditQuestion(

                                                            question

                                                        )

                                                    }

                                                >

                                                    Edit

                                                </button>



                                                <button

                                                    type="button"

                                                    className="interview-btn interview-delete-btn"

                                                    onClick={() =>

                                                        handleDeleteQuestion(

                                                            question.id

                                                        )

                                                    }

                                                >

                                                    Remove

                                                </button>

                                            </div>

                                        </div>

                                    );

                                }

                            )}

                        </div>

                    )}

                </div>

            </div>
			
			{/* =================================================
			    INTERVIEWEE PERSONAL EXPERIENCE
			================================================= */}

			<div className="interview-prep-section">

			    <div className="interview-section-header">

			        <h3>
			            Interviewee Personal Experience
			        </h3>

			        <span className="interview-count">
			            {experiences.length} experiences
			        </span>

			    </div>


			    {/* =============================================
			        ADD EXPERIENCE FORM
			    ============================================== */}

			    <form
			        onSubmit={handleSaveExperience}
			        className="admin-form"
			    >
				
			        <label>
			            Interviewee Name
			        </label>
					<div
						style={{
							display: "flex",
							gap: "10px",
							alignItems: "stretch",
							marginBottom: "22px"
						}}
						>
			        <input
			            type="text"
			            value={experienceName}
			            onChange={(event) =>
			                setExperienceName(
			                    event.target.value
			                )
			            }
			            placeholder="Enter interviewee name"
			            required
			        />

</div>
			        <label>
			            Technology
			        </label>

			        <div
			            style={{
			                display: "flex",
			                gap: "10px",
			                alignItems: "stretch",
							marginBottom: "22px"
			            }}
			        >

			            <select
			                value={experienceCategoryId}
			                onChange={(event) =>
			                    setExperienceCategoryId(
			                        event.target.value
			                    )
			                }
			                style={{
			                    flex: 1
			                }}
			                required
			            >

			                <option value="">
			                    Select Technology
			                </option>

			                {categories.map((category) => (
			                    <option
			                        key={category.id}
			                        value={category.id}
			                    >
			                        {category.name}
			                    </option>
			                ))}

			            </select>

			            <button
			                type="button"
			                className="interview-submit-btn"
			                onClick={handleAddTechnology}
			            >
			                + Add Technology
			            </button>

			        </div>


			        <label>
			            Interview Questions Document
			            <span
			                style={{
			                    fontWeight: 400,
			                    color: "var(--ink-faint)",
			                    marginLeft: "6px",
								marginBottom: "32px"
			                }}
			            >
			                (optional)
			            </span>
			        </label>

			        <input
			            type="file"
			            accept=".docx"
			            onChange={(event) =>
			                setExperienceFile(
			                    event.target.files?.[0] || null
			                )
			            }
			        />


			        <div className="interview-form-actions">

			            <button
			                type="submit"
			                className="interview-submit-btn"
			                disabled={experienceSaving}
			            >
			                {experienceSaving
			                    ? "Saving..."
			                    : "Add Experience"}
			            </button>

			        </div>

			    </form>


			    {/* =============================================
			        EXPERIENCE LIST
			    ============================================== */}

			    <div
			        style={{
			            marginTop: "28px",
						marginBottom: "32px"
			        }}
			    >

			        {experiences.length === 0 ? (

			            <div className="interview-empty-state" 						style={{
									            marginTop: "28px",
												marginBottom: "32px"
									        }}>
			                No interviewee experiences added yet.
			            </div>

			        ) : (

			            <div>

			                {experiences.map((experience) => {

			                    const categoryName =
			                        experience.categoryName ||
			                        getCategoryName(
			                            experience.categoryId,
			                            categories
			                        );

			                    return (

			                        <div
			                            className="interview-question-card"
			                            key={experience.id}
			                            style={{
			                                alignItems: "flex-start"
			                            }}
			                        >

			                            <div
			                                className="interview-question-content"
			                            >

			                                <div
			                                    style={{
			                                        display: "flex",
			                                        alignItems: "center",
			                                        gap: "10px",
			                                        marginBottom: "8px"
			                                    }}
			                                >

			                                    <span
			                                        className={
			                                            `tech-badge ${getTechnologyClass(
			                                                categoryName
			                                            )}`
			                                        }
			                                    >
			                                        {categoryName}
			                                    </span>

			                                </div>


			                                <p
			                                    className="interview-question-text"
			                                    style={{
			                                        fontWeight: 600,
			                                        marginBottom: "4px"
			                                    }}
			                                >
			                                    {experience.intervieweeName}
			                                </p>


			                                {experience.documentName ? (

			                                    <p
			                                        style={{
			                                            margin: 0,
			                                            color: "var(--ink-faint)",
			                                            fontSize: "12px"
			                                        }}
			                                    >
			                                        📄 {experience.documentName}
			                                    </p>

			                                ) : (

			                                    <p
			                                        style={{
			                                            margin: 0,
			                                            color: "var(--ink-faint)",
			                                            fontSize: "12px"
			                                        }}
			                                    >
			                                        No interview questions
			                                        document uploaded
			                                    </p>

			                                )}

			                            </div>


			                            <div
			                                className="interview-actions"
			                                style={{
			                                    display: "flex",
			                                    flexWrap: "wrap",
			                                    gap: "8px",
			                                    justifyContent: "flex-end"
			                                }}
			                            >

			                                {experience.documentName && (

			                                    <button
			                                        type="button"
			                                        className="interview-btn interview-edit-btn"
			                                        onClick={() =>
			                                            handleOpenExperienceDocument(
			                                                experience
			                                            )
			                                        }
			                                    >
			                                        Interview Questions
			                                    </button>

			                                )}


			                                <label
			                                    className="interview-btn interview-edit-btn"
			                                    style={{
			                                        cursor: "pointer"
			                                    }}
			                                >

			                                    Replace Document

			                                    <input
			                                        type="file"
			                                        accept=".docx"
			                                        style={{
			                                            display: "none"
			                                        }}
			                                        onChange={async (event) => {

			                                            const file =
			                                                event.target.files?.[0];

			                                            if (!file) {
			                                                return;
			                                            }

			                                            try {

			                                                setExperienceSaving(
			                                                    true
			                                                );

			                                                await uploadInterviewExperienceDocument(
			                                                    experience.id,
			                                                    file
			                                                );

			                                                await loadData();

			                                                alert(
			                                                    "Document replaced successfully."
			                                                );

			                                            } catch (err) {

			                                                console.error(
			                                                    "Error replacing document:",
			                                                    err
			                                                );

			                                                alert(
			                                                    "Unable to replace the document."
			                                                );

			                                            } finally {

			                                                setExperienceSaving(
			                                                    false
			                                                );

			                                                event.target.value = "";
			                                            }

			                                        }}
			                                    />

			                                </label>


			                                {experience.documentName && (

			                                    <button
			                                        type="button"
			                                        className="interview-btn interview-delete-btn"
			                                        onClick={() =>
			                                            handleDeleteExperienceDocument(
			                                                experience.id
			                                            )
			                                        }
			                                    >
			                                        Remove Document
			                                    </button>

			                                )}


			                                <button
			                                    type="button"
			                                    className="interview-btn interview-delete-btn"
			                                    onClick={() =>
			                                        handleDeleteExperience(
			                                            experience.id
			                                        )
			                                    }
			                                >
			                                    Remove
			                                </button>

			                            </div>

			                        </div>

			                    );

			                })}

			            </div>

			        )}

			    </div>

			</div>



            {/* =================================================

                DIVIDER

            \================================================= */}

            <div

                className="section-divider"

                style={{

                    marginTop: "40px",

                    marginBottom: "32px"

                }}

            />



            {/* =================================================

                FAQ SECTION

            \================================================= */}

            <div className="interview-prep-section">

                <div className="interview-section-header">

                    <h3>

                        FAQs

                    </h3>



                    <span className="interview-count">

                        {faqs.length} FAQs

                    </span>

                </div>



                {/* =============================================

                    FAQ FORM

                \============================================== */}

                <form

                    onSubmit={handleSaveFaq}

                    className="admin-form"

                >

                    <label>

                        Question

                    </label>



                    <input

                        type="text"

                        value={faqQuestion}

                        onChange={(event) =>

                            setFaqQuestion(

                                event.target.value

                            )

                        }

                        placeholder="Enter FAQ question"

                        required

                    />



                    <label>

                        Answer

                    </label>



                    <textarea

                        value={faqAnswer}

                        onChange={(event) =>

                            setFaqAnswer(

                                event.target.value

                            )

                        }

                        placeholder="Enter FAQ answer"

                        rows="5"

                        required

                    />



                    <div className="interview-form-actions">

                        <button

                            type="submit"

                            className="interview-submit-btn"

                            disabled={saving}

                        >

                            {saving

                                ? "Saving..."

                                : editingFaqId

                                    ? "Update FAQ"

                                    : "Add FAQ"}

                        </button>



                        {editingFaqId && (

                            <button

                                type="button"

                                className="interview-cancel-btn"

                                onClick={

                                    resetFaqForm

                                }

                            >

                                Cancel

                            </button>

                        )}

                    </div>

                </form>



                {/* =============================================

                    FAQ LIST

                \============================================== */}

                <div

                    style={{

                        marginTop: "28px"

                    }}

                >

                    {faqs.length === 0 ? (

                        <div className="interview-empty-state">

                            No FAQs added yet.

                        </div>

                    ) : (

                        <div>

                            {faqs.map(

                                (faq) => (

                                    <div

                                        className="faq-card"

                                        key={faq.id}

                                    >

                                        <div

                                            style={{

                                                display: "flex",

                                                justifyContent: "space-between",

                                                alignItems: "flex-start",

                                                gap: "20px"

                                            }}

                                        >

                                            <div

                                                style={{

                                                    flex: 1

                                                }}

                                            >

                                                <h4 className="faq-question">

                                                    {faq.question}

                                                </h4>



                                                <p className="faq-answer">

                                                    {faq.answer}

                                                </p>

                                            </div>



                                            <div className="interview-actions">

                                                <button

                                                    type="button"

                                                    className="interview-btn interview-edit-btn"

                                                    onClick={() =>

                                                        handleEditFaq(

                                                            faq

                                                        )

                                                    }

                                                >

                                                    Edit

                                                </button>



                                                <button

                                                    type="button"

                                                    className="interview-btn interview-delete-btn"

                                                    onClick={() =>

                                                        handleDeleteFaq(

                                                            faq.id

                                                        )

                                                    }

                                                >

                                                    Remove

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )

                            )}

                        </div>

                    )}

                </div>

            </div>



            {showTechnologyModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(51, 57, 77, 0.38)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px"
                    }}
                    onClick={() => {
                        setShowTechnologyModal(false);
                        setNewTechnologyName("");
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-technology-title"
                        style={{
                            width: "100%",
                            maxWidth: "480px",
                            background: "var(--white)",
                            border: "1px solid var(--line)",
                            borderRadius: "var(--radius-lg)",
                            boxShadow: "var(--shadow-pop)",
                            overflow: "hidden"
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "22px 24px",
                                background: "var(--cream-deep)",
                                borderBottom: "1px solid var(--line)"
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin: "0 0 5px",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "11px",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "var(--ink-faint)"
                                    }}
                                >
                                    Interview Prep
                                </p>
                                <h3
                                    id="add-technology-title"
                                    style={{
                                        margin: 0,
                                        fontFamily: "var(--font-display)",
                                        color: "var(--ink)",
                                        fontSize: "22px"
                                    }}
                                >
                                    Add Technology
                                </h3>
                            </div>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => {
                                    setShowTechnologyModal(false);
                                    setNewTechnologyName("");
                                }}
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "50%",
                                    border: "1px solid var(--line)",
                                    background: "var(--white)",
                                    color: "var(--ink-soft)",
                                    fontSize: "20px",
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: "24px" }}>
                            <p
                                style={{
                                    margin: "0 0 18px",
                                    color: "var(--ink-soft)",
                                    fontSize: "14px",
                                    lineHeight: 1.6
                                }}
                            >
                                Add a new technology that can be used for interview questions.
                            </p>

                            <label
                                htmlFor="new-technology-name"
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--ink)"
                                }}
                            >
                                Technology Name
                            </label>

                            <input
                                id="new-technology-name"
                                type="text"
                                value={newTechnologyName}
                                onChange={(event) =>
                                    setNewTechnologyName(event.target.value)
                                }
                                placeholder="e.g. Cloud Computing"
                                autoFocus
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleSaveTechnology();
                                    }
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                    marginTop: "24px"
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowTechnologyModal(false);
                                        setNewTechnologyName("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveTechnology}
                                    disabled={!newTechnologyName.trim()}
                                    style={{
                                        background: "var(--sage)",
                                        borderColor: "var(--sage-deep)",
                                        color: "#2E4D33"
                                    }}
                                >
                                    Add Technology
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>

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

// TECHNOLOGY COLOR CLASS

// =========================================================

function getTechnologyClass(

    categoryName

) {

    if (!categoryName) {

        return "tech-default";

    }



    const name =

        categoryName

            .toLowerCase()

            .trim();



    if (name === "java") {

        return "tech-java";

    }



    if (name === "mainframe") {

        return "tech-mainframe";

    }



    if (name === ".net fsd") {

        return "tech-net-fsd";

    }



    if (name === "fsd") {

        return "tech-fsd";

    }



    if (name === "testing") {

        return "tech-testing";

    }



    if (

        name === "frontend dev" ||

        name === "frontend development"

    ) {

        return "tech-frontend";

    }



    if (

        name === "backend dev" ||

        name === "backend development"

    ) {
        return "tech-backend";
    }
    if (name === "data engineering") {

        return "tech-data-engineering";

    }
    return "tech-default";

}