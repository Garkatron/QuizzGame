import { useState } from "react";
import { getCookie } from "~/cookie";

type QuestionsFormModalProps = {
    active?: boolean;
    onAddQuestion: (question_id: string | null) => void;
};

export function QuestionFormModal({ active = false, onAddQuestion }: QuestionsFormModalProps) {
    const [answers, setAnswers] = useState<string[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [tags, setTags] = useState("");

    const addQuestion = (): void => {
        setAnswers([...answers, ""]);
    }

    const deleteQuestion = (index: number): void => {
        setAnswers(answers.filter((_, i) => i !== index));
    }

    const updateQuestion = (index: number, value: string): void => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    }

    const buildQuestion = () => {
        return {
            question_text: questionText,
            tags: tags.split(",").map(t => t.trim()),
            answers: answers,
        };
    };

    const handleCreateQuestion = async () => {
        const questionObj = buildQuestion();

        const res = await fetch("/api/question/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                user_name: getCookie("username"),
                question_text: questionObj.question_text,
                options: questionObj.answers,
                answer: questionObj.answers[0],
                tags: questionObj.tags,
            }),
        });

        const data = await res.json();
        if (data.success) {
            return data.data._id;
        } else {
            console.error(data.message);
            return null;
        }
    };

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-content">
                <form className="box">

                    {/* Question text */}
                    <div className="field">
                        <label className="label">Question text</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                onChange={(e) => setQuestionText(e.target.value)}

                                placeholder="Enter your question"
                                required
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="field">
                        <label className="label">Tags</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="math, programming, etc"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Answers */}
                    <div className="field">
                        <label className="label">Answers</label>
                        {answers.map((answer, idx) => (
                            <div key={idx} className="field has-addons mb-2">
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="text"
                                        value={answer}
                                        onChange={(e) => updateQuestion(idx, e.target.value)}
                                        placeholder={`Answer ${idx + 1}`}
                                        required
                                    />
                                </div>
                                <div className="control">
                                    <button
                                        type="button"
                                        className="button is-danger"
                                        onClick={() => deleteQuestion(idx)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="button is-success"
                            onClick={addQuestion}
                        >
                            + Add Answer
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="field mt-5">
                        <div className="control">
                            <button
                                type="button"
                                onClick={async () => {
                                    const id = await handleCreateQuestion();
                                    onAddQuestion(id);
                                }}
                                className="button is-primary is-fullwidth"
                            >
                                Create Question
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <button className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}
