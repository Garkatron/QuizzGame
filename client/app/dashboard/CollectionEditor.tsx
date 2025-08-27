import type { JSX } from "react";

export function CollectionEditor(collection: any): JSX.Element {

    return (

        <div className="box">
            <span>{collection.collection.name}</span>
            <ul>
                {
                    collection.collection.tags.map((t: string) => (
                        <li>{t}</li>
                    ))
                }
            </ul>
        </div>




    );
}