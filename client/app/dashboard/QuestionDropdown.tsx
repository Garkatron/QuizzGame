import React from "react";

import type { JSX } from "react";

export type Question = {
    question: string;
    options: string[];
};
type Props = {
    idx: number;
    question: Question;
    toggleOpen: (index: number) => void;
    openIndex: number | null;
};

export function QuestionDropdown({ idx, question, toggleOpen, openIndex }: Props): JSX.Element {

    return (
        <div key={idx} className="box mb-3 has-text-left">
            <div
                className="is-flex is-justify-content-space-between is-align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => toggleOpen(idx)}
            >
                <strong>{question.question}</strong>
                <span className="icon">
                    <i
                        className={`fas ${openIndex === idx ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                </span>
            </div>

            {openIndex === idx && (
                <div className="mt-3">
                    {question.options.map((opt: string, i: number) => (
                        <div key={i} className="field has-addons mb-2">
                            <div className="control is-expanded">
                                <input
                                    className="input"
                                    type="text"
                                    value={opt}
                                    readOnly={false}
                                />
                            </div>
                            <div className="control">
                                <button className="button is-success is-small">Save</button>
                            </div>
                            <div className="control">
                                <button className="button is-info is-small">Edit</button>
                            </div>
                            <div className="control">
                                <button className="button is-danger is-small">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}