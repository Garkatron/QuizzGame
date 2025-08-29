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

        <>
            <button className="box button" onClick={() => setActive(!isActive)}>
                <span>{collection.name}</span> <br /> <span>{collection._id}</span>
                <ul>
                    {collection.tags.map((t: string, i: number) => (
                        <li key={i}>{t}</li>
                    ))}
                </ul>
            </button>
            <CollectionFormModal active={isActive} id={id} onClose={() => { setActive(false); onClose() }} />

        </>
    );
}
