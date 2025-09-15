import { useCallback, useState } from "react";
import { getCookie } from "~/cookie";
import { useUser } from "~/utils/UserContext";
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
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
    const { user } = useUser();

    // * Functions
    const addAnswer = useCallback(() => {
        setAnswers([...answers, ""]);
    }, [answers]);

    const deleteAnswer = useCallback((index: number): void => {
        setAnswers((prev) => {
            const updated = answers.filter((_, i) => i !== index);
            if (correctAnswerIndex === index) {
                return updated;
            }
            if (correctAnswerIndex !== null && correctAnswerIndex > index) {
                setCorrectAnswerIndex(correctAnswerIndex - 1);
            }
            return updated;

        });
    }, [correctAnswerIndex]);

    const updateAnswer = useCallback((index: number, value: string): void => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    }, []);

    // * POST
    const handleCreateQuestion = useCallback(async () => {

        const res = await createQuestion(
            user,
            questionText,
            tags.split(",").map((t) => t.trim()).filter(Boolean),
            answers,
            answers[correctAnswerIndex || 0] || ""
        );
        if (res.isOk) {
            return res.value._id;
        } else {
            alert(res.error)
            return null;
        }
    }, [answers]);

    const resetForm = () => {
        setQuestionText("");
        setTags("");
        setAnswers([]);
        setCorrectAnswerIndex(null);
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
                                value={questionText}
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

                    <div className="field">
                        <label className="label">Answers</label>
                        {answers.map((answer, idx) => (
                            <div key={idx} className="field has-addons mb-2">
                                <div className="control">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={correctAnswerIndex === idx}
                                        onChange={() => setCorrectAnswerIndex(idx)}
                                    />
                                </div>
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="text"
                                        value={answer}
                                        onChange={(e) => updateAnswer(idx, e.target.value)}
                                        placeholder={`Answer ${idx + 1}`}
                                        required
                                    />
                                </div>
                                <div className="control">
                                    <button
                                        type="button"
                                        className="button is-danger"
                                        onClick={() => deleteAnswer(idx)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="button is-success"
                            onClick={addAnswer}
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
                                    resetForm();
                                }}
                                className="button is-primary is-fullwidth"
                            >
                                Create Question
                            </button>
                        </div>
                    </div>
                </form>
            </div >
            <button onClick={() => { onAddQuestion(null) }} className="modal-close is-large" aria-label="close"></button>
        </div >
    );
}
