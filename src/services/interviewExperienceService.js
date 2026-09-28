import api from "./api";
import { renderAsync } from "docx-preview";

export const getInterviewExperiences = async () => {
    const response = await api.get("/interview/experiences");
    return response.data;
};

export const createInterviewExperience = async (data) => {
    const response = await api.post(
        "/admin/interview/experiences",
        {
            intervieweeName: data.intervieweeName,
            categoryId: Number(data.categoryId)
        }
    );

    return response.data;
};

export const updateInterviewExperience = async (id, data) => {
    const response = await api.put(
        `/admin/interview/experiences/${id}`,
        {
            intervieweeName: data.intervieweeName,
            categoryId: Number(data.categoryId)
        }
    );

    return response.data;
};

export const deleteInterviewExperience = async (id) => {
    const response = await api.delete(
        `/admin/interview/experiences/${id}`
    );

    return response.data;
};

export const uploadInterviewExperienceDocument = async (id, file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/admin/interview/experiences/${id}/document`,
        formData
    );

    return response.data;
};

export const deleteInterviewExperienceDocument = async (id) => {
    const response = await api.delete(
        `/admin/interview/experiences/${id}/document`
    );

    return response.data;
};

export const openInterviewExperienceDocument = async (
    id,
    fileName
) => {

    // Open the new tab immediately so the browser
    // does not block the popup.
    const viewerWindow = window.open(
        "",
        "_blank"
    );

    if (!viewerWindow) {
        alert(
            "Please allow pop-ups for this site to open the interview questions."
        );
        return;
    }

    // Show a loading screen immediately.
    viewerWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${"Interview Questions"}</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    background: #FAF6EC;
                    color: #33394D;
                    font-family:
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                .viewer-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    padding: 18px 28px;
                    background: #FFFDF8;
                    border-bottom: 1px solid #E3DCC9;
                    box-shadow:
                        0 2px 12px
                        rgba(51, 57, 77, 0.08);
                }

                .viewer-title {
                    margin: 0;
                    font-family: Georgia, serif;
                    font-size: 22px;
                    color: #33394D;
                }

                .viewer-subtitle {
                    margin: 5px 0 0;
                    color: #8A8FA3;
                    font-size: 12px;
                }

                .viewer-content {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 32px 20px 60px;
                }

                .viewer-loading {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #5B6178;
                    font-size: 14px;
                }

                .viewer-error {
                    max-width: 600px;
                    margin: 80px auto;
                    padding: 24px;
                    background: #F7E4DF;
                    border: 1px solid #CE8F80;
                    border-radius: 14px;
                    color: #6B3226;
                    text-align: center;
                }

                /* DOCX preview pages */
                .docx-container {
                    display: flex;
                    justify-content: center;
                }

                .docx-wrapper {
                    margin: 0 auto !important;
                }

                @media (max-width: 700px) {
                    .viewer-header {
                        padding: 15px 18px;
                    }

                    .viewer-content {
                        padding: 20px 10px 40px;
                    }
                }
            </style>
        </head>

        <body>

            <header class="viewer-header">
                <h1 class="viewer-title">
                    ${"Interview Questions"}
                </h1>

                <p class="viewer-subtitle">
                    Interviewee Personal Experience
                </p>
            </header>

            <main class="viewer-content">

                <div
                    id="loading"
                    class="viewer-loading"
                >
                    Loading interview questions...
                </div>

                <div
                    id="document-container"
                    class="docx-container"
                ></div>

            </main>

        </body>
        </html>
    `);

    viewerWindow.document.close();

    try {

        const response = await api.get(
            `/interview/experiences/${id}/document`,
            {
                responseType: "blob"
            }
        );

        const documentBlob = response.data;

        const container =
            viewerWindow.document.getElementById(
                "document-container"
            );

        const loading =
            viewerWindow.document.getElementById(
                "loading"
            );

        if (loading) {
            loading.remove();
        }

        await renderAsync(
            documentBlob,
            container,
            null,
            {
                className: "docx",
                inWrapper: true,
                breakPages: true,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                renderHeaders: true,
                renderFooters: true,
                renderFootnotes: true,
                renderEndnotes: true
            }
        );

    } catch (error) {

        console.error(
            "Error opening interview questions:",
            error
        );

        const content =
            viewerWindow.document.querySelector(
                ".viewer-content"
            );

        if (content) {

            content.innerHTML = `
                <div class="viewer-error">
                    <strong>
                        Unable to open the interview questions.
                    </strong>

                    <p>
                        Please try again.
                    </p>
                </div>
            `;
        }
    }
};