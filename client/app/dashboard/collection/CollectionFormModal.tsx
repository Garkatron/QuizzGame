import { useEffect, useState } from "react";
import { QuestionFormModal } from "../question/QuestionFormModal";
import { getCookie } from "~/cookie";
import type { Question } from "~/owntypes";
import { QuestionDropdown } from "../question/QuestionDropdown";

type CollectionFormModalProps = {
    active?: boolean;
    id: string | null;
    onClose: () => void;
};

export function CollectionFormModal({ active = false, id = null, onClose }: CollectionFormModalProps) {
    // * State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");
    const [isQuestionMenuOpen, openQuestionMenu] = useState<boolean>(false);

    const [openIndex, setOpenIndex] = useState<number | null>(null);


    // * Functions
    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleDeleteQuestion = (idx: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
    };

    const addQuestion = (qid: string) => {
        fetch(`/api/questions/id/${qid}`)
            .then(res => res.json())
            .then(json => {
                if (json.data) {
                    setQuestions(prev => [...prev, json.data]);
                }
            })
            .catch(err => console.error(err));
    };

    // * If edit
    if (id) {
        useEffect(() => {
            // * Questions by owner
            fetch(`/api/collections/id/${id}`)
                .then(res => res.json())
                .then(json => {
                    if (json.data) {
                        setQuestions(json.data.questions);
                        setCollectionName(json.data.name);
                    }
                })
                .catch(err => console.error(err));
        }, []);
    }

    // * Post
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
            onClose();
            return data.data._id;
        } else {
            console.error(data.message);
            return null;
        }
    };

    const handleSaveCollection = () => {
        onClose();
    };

    const handleDeleteCollection = () => {
        onClose();

    };

    const handleCancelCollection = () => {
        onClose();

    };



    // * JSX
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
                                value={collectionName}
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

                            {questions.map((question, idx) => (
                                <div key={idx} className="is-align-items-center mb-2">
                                    <QuestionDropdown
                                        idx={idx}
                                        question={question}
                                        toggleOpen={toggleOpen}
                                        openIndex={openIndex}
                                    />
                                    <button
                                        type="button"
                                        className="button is-danger is-small ml-2"
                                        onClick={() => handleDeleteQuestion(idx)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            ))}

                            <button onClick={() => openQuestionMenu(true)} className="button" type="button">+</button>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="field mt-5">
                        <div className="control">

                            {id ? (
                                <>
                                    <button type="button" onClick={handleDeleteCollection} className="button is-danger is-fullwidth">
                                        Delete
                                    </button>

                                    <button type="button" onClick={handleSaveCollection} className="button is-primary is-fullwidth">
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" onClick={handleCreateCollection} className="button is-primary is-fullwidth">
                                        Create
                                    </button>
                                    <button type="button" onClick={handleCancelCollection} className="button is-light is-fullwidth">
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>

            </div>

            // * FORM
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