import { useState } from "react";
import { QuestionFormModal } from "./QuestionFormModal";
import { getCookie } from "~/cookie";

type CollectionFormModalProps = {
    active?: boolean;
};

export function CollectionFormModal({ active = false }: CollectionFormModalProps) {
    const [questions, setQuestions] = useState<string[]>([]);
    const [isQuestionMenuOpen, openQuestionMenu] = useState<boolean>(false);
    const [collectionName, setCollectionName] = useState<string>("");

    const addQuestion = (qid: string): void => {
        setQuestions([...questions, qid]);
    }

    const handleCreateCollection = async () => {

        const res = await fetch("/api/collection/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                user_name: getCookie("username"),
                questions: questions,
                tags: [],
                name: collectionName,
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

                <form>
                    {/* Name */}
                    <div className="field">
                        <label className="label">Collection name</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                placeholder="Name of your collection"
                                required
                                onChange={(e) => { setCollectionName(e.target.value) }}
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



                            <button onClick={() => openQuestionMenu(true)} className="button" type="button">+</button>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="field mt-5">
                        <div className="control">
                            <button type="submit" onClick={async () => {
                                const _id = await handleCreateCollection();

                            }} className="button is-primary is-fullwidth">
                                Create
                            </button>
                        </div>
                    </div>
                </form>

            </div>
            <QuestionFormModal active={isQuestionMenuOpen} onAddQuestion={(question_id: string | null) => {
                if (question_id) {
                    addQuestion(question_id);
                }
                openQuestionMenu(false);

            }} />
            <button className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}