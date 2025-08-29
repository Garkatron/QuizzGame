import { useState } from "react";
import { Link } from "react-router";
import { CollectionFormModal } from "~/dashboard/collection/CollectionFormModal";
import type { Collection } from "~/utils/owntypes";
import { useFetch } from "~/utils/utils";

export type CollectionGalleryProps = {
    collection: Collection, editable: boolean
};
export function CollectionGalleryItem({ collection, editable = false }: CollectionGalleryProps) {

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

                <div className="buttons is-flex is-justify-content-center">
                    <Link to={`/quiz/singleplayer/${collection._id}`} className="button is-primary is-large is-fullwidth">
                        Play
                    </Link>
                    {
                        editable && (
                            <button className="button" onClick={() => setActive(true)}>
                                Edit
                            </button>
                        )
                    }
                </div>
            </div>
            <CollectionFormModal active={isActive} id={collection._id} onClose={() => { setActive(false); }} />

        </div>
    );
}