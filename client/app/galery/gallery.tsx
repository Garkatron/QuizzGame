import { hasPermission, useFetch } from "~/utils/utils";
import { CollectionGalleryItem } from "./CollectionGalleryItem";
import type { Collection, Question, User } from "~/utils/owntypes";
import { useEffect, useMemo, useState } from "react";
import "./custom.css";
import { QuestionGalleryItem } from "~/dashboard/question/QuestionGalleryItem";
import { useUser } from "~/utils/UserContext";
import { UserGalleryItem } from "~/dashboard/UserGalleryItem";

export function Gallery() {


    const { data: collections, loading: isLoadingCollections, error: errorWithCollections, refetch: refreshCollections } =
        useFetch<Collection[]>("/api/collections");


    const { data: questions, loading: isLoadingQuestions, error: errorWithQuestions, refetch: refreshQuestions } =
        useFetch<Question[]>("/api/questions");

    const { data: users, loading: isLoadingUsers, error: errorWithUsers, refetch: refreshUsers } =
        useFetch<User[]>("/api/users");

    const [activeTab, setActiveTab] = useState<"questions" | "collections" | "users">("questions");


    const [search, setSearch] = useState("");

    const filteredCollections = useMemo(() => {
        if (!collections) return [];
        const term = search.trim().toLowerCase();
        return collections.filter(c => c.name.toLowerCase().includes(term));
    }, [collections, search]);

    const collectionsContent = filteredCollections.map((collection, key) => (
        <CollectionGalleryItem key={collection._id} collection={collection} editable={hasPermission("EDIT_COLLECTION")} onUpdate={refreshCollections} />
    ));

    const filteredQuestions = useMemo(() => {
        if (!questions) return [];
        const term = search.trim().toLowerCase();
        return questions.filter(q => q.question.toLowerCase().includes(term));
    }, [questions, search]);

    const questionsContent = filteredQuestions.map((question, key) => (
        <QuestionGalleryItem key={question._id} question={question} editable={hasPermission("EDIT_QUESTION")} onUpdate={refreshQuestions} />
    ));

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const term = search.trim().toLowerCase();
        return users.filter(u => u.name.toLowerCase().includes(term));
    }, [users, search]);

    const usersContent = filteredUsers.map((user, key) => (
        <UserGalleryItem key={user.name} user={user} editable={hasPermission("EDIT_USER")} onUpdate={refreshUsers} />
    ));

    const renderContent = () => {
        if (activeTab === "collections") return collectionsContent;
        if (activeTab === "questions") return questionsContent;
        return usersContent;
    };

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


    if (errorWithUsers) {
        return (
            <div className="notification is-danger has-text-centered my-6">
                Error loading users. Please try again.
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
                    <div className="tabs">
                        <ul>
                            <li className={activeTab === "collections" ? "is-active" : ""}><a onClick={() => setActiveTab("collections")} >Collections</a></li>
                            <li className={activeTab === "questions" ? "is-active" : ""}><a onClick={() => setActiveTab("questions")}>Questions</a></li>
                            <li className={activeTab === "users" ? "is-active" : ""}><a onClick={() => setActiveTab("users")}>Users</a></li>
                        </ul>
                    </div>
                </nav>
            </div>

            <div className="columns is-multiline is-variable is-3 px-5">
                {renderContent()}
            </div>
        </main>

    );
}