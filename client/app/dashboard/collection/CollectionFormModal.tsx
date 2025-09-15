import { useCallback, useEffect, useState } from "react";
import { QuestionFormModal } from "../question/QuestionFormModal";
import { getCookie } from "~/cookie";
import type { Question } from "~/utils/owntypes";
import { QuestionGalleryItem } from "../question/QuestionGalleryItem";
import { getCollectionByID, getQuestionByID, deleteCollection, updateCollection, createCollection } from "~/utils/utils";

type CollectionFormModalProps = {
    active?: boolean;
    id: string | null;
    onClose: () => void;
};

export function CollectionFormModal({ active = false, id = null, onClose }: CollectionFormModalProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");
    const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState<boolean>(false);
    const [ownerId, setOwnerId] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await getCollectionByID(id);
                setQuestions(data.questions);
                setCollectionName(data.name);
                setOwnerId(data.owner);
            } catch (error) {
                alert(error);
            }
        })();
    }, [id]);

    const handleDeleteQuestion = useCallback((idx: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
    }, []);

    const handleCreateCollection = useCallback(async () => {
        const res = await createCollection(questions, [], collectionName);

        if (res.isErr) {
            alert(res.error);
        }

        onClose();
    }, [questions, collectionName, onClose]);

    const handleSaveCollection = useCallback(async () => {
        if (!id) return;
        const res = await updateCollection({
            _id: id,
            owner: ownerId,
            name: collectionName,
            questions,
            tags: []
        });
        if (res.isErr) return alert(res.error);
        onClose();
    }, [id, ownerId, collectionName, questions, onClose]);

    const handleDeleteCollection = useCallback(async () => {
        if (!id) return;
        const res = await deleteCollection(ownerId, id);
        if (res.isErr) alert("Error deleting collection: " + res.error);
        onClose();
    }, [id, ownerId, onClose]);

    const handleAddQuestion = useCallback(async (question_id: string | null) => {
        if (question_id) {
            const newQ = await getQuestionByID(question_id);
            if (newQ.isErr) {
                alert(newQ.error);
            } else {
                setQuestions((prev) => [...prev, newQ.value]);
            }
        }
        setIsQuestionMenuOpen(false);
    }, []);

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
                                            onUpdate={() => { setIsQuestionMenuOpen(false) }}
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

                            <button onClick={() => setIsQuestionMenuOpen(true)} className="button mt-2" type="button">+ Add Question</button>
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
                                    <button type="button" onClick={onClose} className="button is-light is-fullwidth">
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
                onAddQuestion={handleAddQuestion}
            />
            <button onClick={onClose} className="modal-close is-large" aria-label="close"></button>
        </div>
    );
}