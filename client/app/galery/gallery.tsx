import { useFetch } from "~/utils/utils";
import { CollectionGalleryItem } from "./CollectionGalleryItem";
import type { Collection } from "~/utils/owntypes";
import { useEffect, useMemo, useState } from "react";

export function Gallery() {
    const { data: collections, loading: isLoadingCollections, error: errorWithCollections, refetch: refreshCollections } =
        useFetch<Collection[]>("/api/collections");

    const [search, setSearch] = useState("");

    const filteredCollections = useMemo(() => {
        if (!collections) return [];
        const term = search.trim().toLowerCase();
        return collections.filter(c => c.name.toLowerCase().includes(term));
    }, [collections, search]);

    const content = filteredCollections.map((collection, key) => (
        <CollectionGalleryItem key={key} collection={collection} />
    ));

    if (isLoadingCollections) {
        return (
            <div className="has-text-centered py-6">
                <button className="button is-loading is-large is-primary">Loading...</button>
            </div>
        );
    }

    if (errorWithCollections) {
        return (
            <div className="notification is-danger has-text-centered my-6">
                Error loading collections. Please try again.
            </div>
        );
    }


    return (


        <main>
            <div className="hero is-primary has-text-centered p-6">
                <h1 className="title is-2 mb-4">Quiz Finder</h1>
                <h2 className="subtitle is-4 mb-5">Search quizzes and questions</h2>

                <nav className="panel">
                    <div className="panel-block">
                        <p className="control has-icons-left">
                            <input className="input" type="text" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                            <span className="icon is-left">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </span>
                        </p>
                    </div>
                </nav>
            </div>

            <div className="columns is-multiline is-variable is-3 px-5">

                {
                    content
                }

            </div>
        </main>

    );
}