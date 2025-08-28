import { useState } from "react";
import { getCookie } from "~/cookie";
import { createQuestion } from "~/utils/utils";

type QuestionsFormModalProps = {
    active?: boolean;
    onAddQuestion: (question_id: string | null) => void;
};

export function QuestionFormModal({ active = false, onAddQuestion }: QuestionsFormModalProps) {

    // * State
    const [answers, setAnswers] = useState<string[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [tags, setTags] = useState("");

    // * Functions
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

    // * POST
    const handleCreateQuestion = async () => {
        try {
            const res = await createQuestion(questionText, tags.split(",").map(t => t.trim()), answers, answers[0]);
            console.log(res);

            if (res.success) {
                return res.data._id;
            } else {
                console.error(res.error);
                return null;
            }
        } catch (error) {
            alert(error);
            return null;
        }
    };

    // * JSX
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
                        {/* Answer */}
                        {answers.map((answer, idx) => (
                            < div key={idx} className="field has-addons mb-2" >
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
                        {/* Add question button */}
                        <button
                            type="button"
                            className="button is-success"
                            onClick={addQuestion}
                        >
                            +
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
            </div >
            <button className="modal-close is-large" aria-label="close"></button>
        </div >
    );
}
