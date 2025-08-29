import { useEffect, useMemo, useState, type JSX } from "react";
import { QuestionDropdown } from "./question/QuestionDropdown";
import { CollectionItem } from "./collection/CollectionItem";
import { CollectionFormModal } from "./collection/CollectionFormModal";
import { QuestionFormModal } from "./question/QuestionFormModal";
import { getCookie } from "~/cookie";
import type { Collection, Question } from "~/utils/owntypes";
import { useFetch } from "~/utils/utils";
import { useUser } from "~/utils/UserContext";


export function Dashboard() {

    const { username } = useUser();

    // * State
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const { data: questions, loading: isLoadingQuestions, error: errorWithQuestions, refetch: refreshQuestions } =
        useFetch<Question[]>(username ? `/api/questions/owner/${username}` : null);

    const { data: collections, loading: isLoadingCollections, error: errorWithCollections, refetch: refreshCollections } =
        useFetch<Collection[]>(username ? `/api/collections/owner/${username}` : null);


    // * Menu
    const [activeTab, setActiveTab] = useState<"questions" | "collections">("collections");
    const [isFormOpen, openForm] = useState<boolean>(false);

    // * Fuctions
    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCloseForm = () => {
        openForm(false);
        if (activeTab === "questions") {
            refreshQuestions();
        } else {
            refreshCollections();
        }
    };

    // * Prepare
    const content = useMemo(() => {
        if (activeTab === "questions") {
            if (isLoadingQuestions || !questions) return <p>Loading...</p>;
            return questions.map((question, idx) => (
                <QuestionDropdown key={idx} idx={idx} question={question} toggleOpen={toggleOpen} openIndex={openIndex} />
            ));
        } else {
            if (isLoadingCollections || !collections) return <p>Loading...</p>;
            return collections.map((c, idx) => (
                <CollectionItem key={idx} idx={idx} collection={c} id={c._id} onClose={() => handleCloseForm()} />
            ));
        }
    }, [activeTab, questions, collections, openIndex, isLoadingQuestions, isLoadingCollections]);


    // * JSX
    return (
        <main>
            {/* BANNER */}
            <div className="hero is-info has-text-centered p-6">
                <h1 className="title is-2 mb-4">Quiz Finder</h1>
                <h2 className="subtitle is-4 mb-5">Search quizzes and questions</h2>

                <nav className="panel">
                    <div className="panel-block">
                        <p className="control has-icons-left">
                            <input className="input" type="text" placeholder="Search" onChange={(e) => { }} />
                            <span className="icon is-left">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </span>
                        </p>
                    </div>
                </nav>

                <div className="tabs is-centered mb-5">
                    <ul>
                        <li className={activeTab === "questions" ? "is-active" : ""}>
                            <a onClick={() => setActiveTab("questions")}>Questions ⚡</a>
                        </li>
                        <li className={activeTab === "collections" ? "is-active" : ""}>
                            <a onClick={() => setActiveTab("collections")}>Collections 📚</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{ maxWidth: "700px", width: "100%" }}>
                {/* SCROLLABLE BLOCK */}
                <div className="columns is-multiline is-variable is-3 px-5">

                    {
                        content

                    }
                    {/* BUTTONS */}
                    <div className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
                        <div className="box has-text-centered p-5">
                            <button
                                onClick={() => openForm(!isFormOpen)}
                                className="button is-success is-fullwidth is-fullheight"
                            >
                                New
                            </button>

                        </div>
                    </div>

                </div>
                {activeTab === "questions" ? (
                    <QuestionFormModal
                        active={isFormOpen}
                        onAddQuestion={() => handleCloseForm()}
                    />
                ) : (
                    <CollectionFormModal
                        active={isFormOpen}
                        id={null}
                        onClose={() => handleCloseForm()}
                    />
                )}

            </div>
        </main>
    );
}
