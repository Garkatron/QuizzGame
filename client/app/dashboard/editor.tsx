import { useEffect, useState, type JSX } from "react";
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
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [collectionToEditID, setCollectionToEditID] = useState<string | null>(null);

    const { data: questions, loading: isLoadingQuestions, error: errorWithQuestions } =
        useFetch<Question[]>(username ? `/api/questions/owner/${username}` : null);

    const { data: collections, loading: isLoadingCollections, error: errorWithCollections } =
        useFetch<Collection[]>(username ? `/api/collections/owner/${username}` : null);


    // * Menu
    const [activeTab, setActiveTab] = useState<"questions" | "collections">("collections");
    const [isOpenQuestionForm, openQuestionForm] = useState<boolean>(false);

    // * Fuctions
    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    let content;

    if (activeTab === "questions") {
        if (isLoadingQuestions || !questions) {
            content = <p>Loading...</p>;
        } else {
            content = questions.map((question: Question, idx: number) => (
                <QuestionDropdown
                    key={idx}
                    idx={idx}
                    question={question}
                    toggleOpen={toggleOpen}
                    openIndex={openIndex}
                />
            ));
        }
    } else {

        if (isLoadingCollections || !collections) {
            content = <p>Loading...</p>;
        } else {
            content = collections.map((c: Collection, idx: number) => (
                <CollectionItem key={idx} idx={idx} collection={c} id={c._id} />
            ));
        }
    }


    // * JSX
    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            {/* BANNER */}
            <div
                className="has-text-centered p-6"
                style={{ maxWidth: "700px", width: "100%", maxHeight: "200px" }}
            >
                <h1 className="title is-2 mb-4">Quiz Builder</h1>
                <h2 className="subtitle is-4 mb-5">Manage your questions and collections</h2>

                {/* TABS */}
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

            {/* SECTIONS */}
            <div className="section" style={{ maxWidth: "700px", width: "100%", minHeight: "600px" }}>
                <div className="block" style={{ height: "700px", overflowY: "scroll", paddingRight: "10px" }}>
                    {content}
                </div>

                {/* BUTTON & MENU */}
                <div className="buttons is-centered is-flex-wrap-wrap mt-4">
                    <button onClick={() => { openQuestionForm(!isOpenQuestionForm) }} className="button is-success mb-2 mr-2">New</button>
                </div>

                {
                    activeTab === "questions" ? // IF
                        (<QuestionFormModal active={isOpenQuestionForm} onAddQuestion={() => { }} />) // Questions
                        :
                        (<CollectionFormModal active={isOpenQuestionForm} id={null} onClose={() => { }} />)
                }
            </div>
        </main>
    );
}
