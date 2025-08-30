import { useEffect, useState } from "react";
import { QuestionFormModal } from "../question/QuestionFormModal";
import { getCookie } from "~/cookie";
import type { Question } from "~/utils/owntypes";
import { QuestionGalleryItem } from "../question/QuestionGalleryItem";
import { addCollectionByID, getQuestionByID, deleteCollection, updateCollection, createCollection } from "~/utils/utils";

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
    const [ownerId, setOwnerId] = useState<string>("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);


    // * Functions
    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleDeleteQuestion = (idx: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
    };


    // * If edit
    if (id) {
        useEffect(() => {
            // * Questions by owner

            try {
                addCollectionByID(id).then((data) => {
                    setQuestions(data.questions);
                    setCollectionName(data.name);
                    setOwnerId(data.owner);
                });
            } catch (error) {
                alert(error);
            }
        }, []);
    }

    // * Post
    const handleCreateCollection = async () => {
        const res = await createCollection(questions, [], collectionName);

        if (res.isErr) {
            alert("Error creating collection");
        }

        onClose();
    };

    const handleSaveCollection = async () => {
        if (!id) return;

        const res = await updateCollection({ _id: id, owner: ownerId, name: collectionName, questions, tags: [] });

        if (res.isErr) {
            alert(res.error);
        }

        onClose();
    };

    const handleDeleteCollection = async () => {
        const res = await deleteCollection(ownerId, id);
        if (res.isErr) {
            alert("Error deleting collection");
        }
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
                                    <QuestionGalleryItem
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
                                    <button type="button" onClick={async () => await handleDeleteCollection()} className="button is-danger is-fullwidth">
                                        Delete
                                    </button>

                                    <button type="button" onClick={async () => {
                                        await handleSaveCollection()
                                    }} className="button is-primary is-fullwidth">
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
            <QuestionFormModal
                active={isQuestionMenuOpen}
                onAddQuestion={async (question_id: string | null) => {
                    if (question_id) {
                        const newQ = await getQuestionByID(question_id);
                        if (newQ.isErr) {
                            alert("Error getting question");
                        } else {
                            setQuestions((prev) => [...prev, newQ.value]);
                        }
                    }
                    openQuestionMenu(false);
                }}
            />
            <button className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}