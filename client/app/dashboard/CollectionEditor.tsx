import type { JSX } from "react";

export function CollectionEditor(collection: any): JSX.Element {
    return (
        <>
            <div className="box">{collection.name}</div>

        </>


    );
}