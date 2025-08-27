import React, { useEffect, useState } from "react";

import type { JSX } from "react";
import { getCookie } from "~/cookie";

export type Question = {
    _id: string,
    question: string;
    options: string[];
    tags: string
};
type Props = {
    idx: number;
    question: Question;
    toggleOpen: (index: number) => void;
    openIndex: number | null;
};

export function QuestionDropdown({ idx, question, toggleOpen, openIndex }: Props): JSX.Element {
    const [options, setOptions] = useState<string[]>(question.options);
    const [name, setName] = useState<string>(question.question);

    const handleOptionChange = (i: number, value: string) => {
        const newOptions = [...options];
        newOptions[i] = value;
        setOptions(newOptions);
    };

    const handleSaveAll = async () => {
        await fetch("/api/question/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                id: question._id,
                field: "options",
                value: options,
            }),
        });

        await fetch("/api/question/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                id: question._id,
                field: "question",
                value: name,
            }),
        });
    };
    return (
        <div className="box mb-4 has-text-left">
            {/* Encabezado */}
            <div
                className="is-flex is-justify-content-space-between is-align-items-center p-2"
                style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #eaeaea",
                }}
                onClick={() => toggleOpen(idx)}
            >
                <input
                    className="input is-size-5 has-text-weight-semibold"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: "none", boxShadow: "none" }}
                />
                <span className="icon">
                    <i
                        className={`fas ${openIndex === idx ? "fa-chevron-up" : "fa-chevron-down"
                            }`}
                    ></i>
                </span>
            </div>

            {/* Tags */}
            <div className="mt-2 mb-3">
                <span className="tag is-info is-warning">#{question.tags}</span>
            </div>

            {/* Opciones */}
            <div
                className={`mt-3 transition-all ${openIndex === idx ? "is-block" : "is-hidden"
                    }`}
            >
                {options.map((opt, i) => (
                    <div
                        key={i}
                        className="field is-flex is-align-items-center mb-2"
                        style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "6px" }}
                    >
                        <span className="mr-2 has-text-grey">{i + 1}.</span>
                        <div className="control is-expanded">
                            <input
                                className="input"
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {/* Botón Save */}
                <button
                    onClick={handleSaveAll}
                    className="button is-primary is-fullwidth mt-3"
                    type="button"
                >
                    💾 Save Changes
                </button>
            </div>
        </div>
    );
}