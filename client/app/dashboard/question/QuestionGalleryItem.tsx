import React, { useEffect, useState } from "react";

import type { JSX } from "react";
import { getCookie } from "~/cookie";
import type { Question } from "~/utils/owntypes";
import { deleteQuestion, updateQuestion } from "~/utils/utils";


type QuestionGalleryItemProps = {
    question: Question;
    editable: boolean;
    small: boolean; // ! Trick
    onUpdate: () => void;
};

export function QuestionGalleryItem({ question, editable = true, onUpdate, small = false }: QuestionGalleryItemProps): JSX.Element {
    const [options, setOptions] = useState<string[]>(question.options);
    const [name, setName] = useState<string>(question.question);
    const [active, setActive] = useState<boolean>(false);

    const handleOptionChange = (i: number, value: string) => {
        const newOptions = [...options];
        newOptions[i] = value;
        setOptions(newOptions);
    };

    const handleDelete = async () => {
        setActive(false);
        const res = await deleteQuestion(question._id);
        if (res.isErr) {
            alert(res.error);
        }
        onUpdate();

    }

    const handleSaveAll = async () => {
        try {
            const originalOptions = [...options];
            const originalName = name;

            const [resultOptions, resultQuestion] = await Promise.all([
                updateQuestion(question._id, "options", options),
                updateQuestion(question._id, "question", name),
            ]);

            if (!(resultOptions.isOk && resultQuestion.isOk)) {
                setOptions(originalOptions);
                setName(originalName);
                console.error("Update failed:", resultOptions, resultQuestion);
                alert(
                    `Failed to update question:\n${resultOptions.isOk ? "" : resultOptions.error}\n${resultQuestion.isOk ? "" : resultQuestion.error}`
                );
            }
        } catch (err) {
            console.error("Unexpected error in handleSaveAll:", err);
            alert("An unexpected error occurred while updating the question.");
        }
    };


    return (
        <div className={`column ${!small && "is-12-mobile is-6-tablet is-4-desktop is-3-widescreen"}`}>
            {/* Header */}
            <div
                className="is-flex is-justify-content-space-between is-align-items-center p-2"
                style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #eaeaea",
                }}
                onClick={() => setActive(!active)}
            >
                <input
                    className="input is-size-5 has-text-weight-semibold"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: "none", boxShadow: "none" }}
                    readOnly={!editable}
                />
                <span className="icon">
                    <i className={`fas ${active ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                </span>
            </div>

            {/* Tags */}
            <div className="tags  mb-3">
                {
                    question.tags.map((tag: string, key: number) => (
                        <span key={key} className="tag is-info">#{tag}</span>
                    ))
                }
            </div>

            {/* Opctions */}
            <div className={`mt-3 transition-all ${active ? "is-block" : "is-hidden"}`}>
                {options.map((opt, i) => (
                    <div key={i} className="field is-flex is-align-items-center mb-2"
                        style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "6px" }}
                    >
                        <span className="mr-2 has-text-grey">{i + 1}.</span>
                        <div className="control is-expanded">
                            <input
                                className="input"
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                readOnly={!editable}
                            />
                        </div>
                    </div>
                ))}

                {/** Button */}
                {
                    editable ? (
                        <>
                            <button
                                onClick={handleSaveAll}
                                className="button is-primary is-fullwidth mt-3"
                                type="button"
                            >
                                Save Changes
                            </button>
                            <button
                                className="button is-danger is-fullwidth mt-3"
                                type="button"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <></>
                    )
                }
            </div>
        </div>
    );
}