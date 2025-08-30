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
            alert(res.error);
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
            alert("Error deleting collection: " + res.error);
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

                    {/* Questions */}
                    <div className="field">
                        <label className="label">Questions</label>
                        <div className="control">

                            {questions.map((question, key) => (
                                <div key={key} className="field is-grouped is-grouped-multiline mb-2">
                                    <div className="control is-expanded">
                                        <QuestionGalleryItem
                                            small={true}
                                            question={question}
                                            editable={true}
                                            onUpdate={() => { openQuestionMenu(false) }}
                                        />
                                    </div>
                                    <div className="control">
                                        <button
                                            type="button"
                                            className="button is-danger is-small"
                                            onClick={() => handleDeleteQuestion(key)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button onClick={() => openQuestionMenu(true)} className="button mt-2" type="button">+ Add Question</button>
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
                            alert(newQ.error);
                        } else {
                            setQuestions((prev) => [...prev, newQ.value]);
                        }
                    }
                    openQuestionMenu(false);
                }}
            />
            <button onClick={onClose} className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}