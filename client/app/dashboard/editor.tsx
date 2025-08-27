import { useEffect, useState, type JSX } from "react";
import { QuestionDropdown, type Question } from "./QuestionDropdown";
import { CollectionEditor } from "./CollectionEditor";
import { CollectionFormModal } from "./CollectionFormModal";
import { QuestionFormModal } from "./QuestionFormModal";


export function Dashboard() {
    const [activeTab, setActiveTab] = useState<"questions" | "collections">("questions");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [collections, setCollections] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/questions")
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json.data)) {
                    setQuestions(json.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        fetch("/api/collections")
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json.data)) {
                    setCollections(json.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const newElement = () => {
        if (activeTab === "questions") {

        } else if (activeTab === "collections") {

        }
    }

    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div
                className="box has-text-centered p-6"
                style={{ maxWidth: "600px", width: "100%" }}
            >
                <h1 className="title is-2 mb-4">Quiz Builder</h1>
                <h2 className="subtitle is-4 mb-5">Manage your questions and collections</h2>

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

                {loading ? (
                    <h2 className="title is-2">Loading...</h2>
                ) : (
                    <div className="block" style={{ height: "400px", overflowY: "auto" }}>
                        {

                            activeTab === "questions" ?
                                (questions.map((q: Question, idx: number) => (
                                    <QuestionDropdown
                                        key={idx}
                                        idx={idx}
                                        question={q}
                                        toggleOpen={toggleOpen}
                                        openIndex={openIndex}
                                    />
                                ))) : (
                                    collections.map((c: any, idx: number) => (

                                        <CollectionEditor collection={c} />
                                    )
                                    ))

                        }
                    </div>
                )}

                <CollectionFormModal active={true} />


                <div className="buttons is-centered is-flex-wrap-wrap mt-4">
                    <button className="button is-success mb-2 mr-2">New</button>
                </div>
            </div>
        </main>
    );
}
