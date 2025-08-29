import { useState, type JSX } from "react";

import { type Collection } from "../../utils/owntypes";
import { QuestionFormModal } from "../question/QuestionFormModal";
import { CollectionFormModal } from "./CollectionFormModal";

export type CollectionItemProps = {
    collection: Collection;
    idx: number;
    id: string;
    onClose: () => void
};

export function CollectionItem({ idx, collection, id, onClose }: CollectionItemProps): JSX.Element {
    const [isActive, setActive] = useState(false);

    return (
        <div className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
            <div className="box has-text-centered p-5">
                <h3 className="title is-4 mb-2">{collection.name}</h3>

                <div
                    className="tags is-justify-content-center mb-3"
                    style={{ flexWrap: "nowrap", overflowX: "auto" }}
                >
                    {
                        collection.tags.map((tag) => (
                            <span className="tag is-info">#{tag}</span>
                        ))
                    }
                </div>

                <p className="mb-4 has-text-grey">{collection.questions.length} Questions</p>

                <button onClick={() => setActive(!isActive)} className="buttons is-flex is-justify-content-center">
                    Edit
                </button>
            </div>
            <CollectionFormModal active={isActive} id={id} onClose={() => { setActive(false); onClose() }} />
        </div>

    );
}


/*
<button className="box button" onClick={() => setActive(!isActive)}>
                    <span>{collection.name}</span> <br /> <span>{collection._id}</span>
                    <ul>
                        {collection.tags.map((t: string, i: number) => (
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                </button>
                <CollectionFormModal active={isActive} id={id} onClose={() => { setActive(false); onClose() }} />

*/