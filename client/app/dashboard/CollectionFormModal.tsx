import { useState } from "react";
import { QuestionFormModal } from "./QuestionFormModal";

type CollectionFormModalProps = {
    active?: boolean;
};

export function CollectionFormModal({ active = false }: CollectionFormModalProps) {
    const [questions, setQuestions] = useState<string[]>([]);
    const [isQuestionMenuOpen, openQuestionMenu] = useState<boolean>(false);

    const addQuestion = (qid: string): void => {
        setQuestions([...questions, qid]);
    }

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-content">

                <form>
                    {/* Name */}
                    <div className="field">
                        <label className="label">Collection name</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="email"
                                placeholder="Name of your collection"
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="field">
                        <label className="label">Questions</label>
                        <div className="control has-icons-left">

                            {questions.map((q, idx) => (
                                <input
                                    key={idx}
                                    className="block input"
                                    type="text"
                                    value={q}
                                    required
                                />
                            ))}

                            <QuestionFormModal active={isQuestionMenuOpen} onAddQuestion={(question_id: string | null) => {
                                if (question_id) {
                                    addQuestion(question_id);
                                }
                                openQuestionMenu(false);

                            }} />

                            <button onClick={() => openQuestionMenu(true)} className="button" type="button">+</button>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="field mt-5">
                        <div className="control">
                            <button type="submit" className="button is-primary is-fullwidth">
                                Create
                            </button>
                        </div>
                    </div>
                </form>

            </div>
            <button className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}