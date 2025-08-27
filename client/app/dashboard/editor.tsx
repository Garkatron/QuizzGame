import { useEffect, useState, type JSX } from "react";
import { QuestionDropdown, type Question } from "./QuestionDropdown";
import { CollectionEditor } from "./CollectionEditor";
import { CollectionFormModal } from "./CollectionFormModal";
import { QuestionFormModal } from "./QuestionFormModal";
import { getCookie } from "~/cookie";


export function Dashboard() {
    const [activeTab, setActiveTab] = useState<"questions" | "collections">("questions");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [collections, setCollections] = useState<any[]>([]);

    const [isMenuOpen, openMenu] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {

        fetch(`/api/questions/owner/${getCookie("username")}`)
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json.data)) {
                    setQuestions(json.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        fetch(`/api/collections/${getCookie("username")}`)
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
                className="has-text-centered p-6"
                style={{ maxWidth: "700px", width: "100%", maxHeight: "200px" }}
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
            </div>

            <div className="section" style={{ maxWidth: "700px", width: "100%", minHeight: "600px" }}>
                {loading ? (
                    <h2 className="title is-2">Loading...</h2>
                ) : (
                    <div
                        className="block"
                        style={{
                            height: "700px",
                            overflowY: "scroll",
                            paddingRight: "10px",
                        }}
                    >
                        {activeTab === "questions"
                            ? questions.map((q: Question, idx: number) => (
                                <QuestionDropdown
                                    key={idx}
                                    idx={idx}
                                    question={q}
                                    toggleOpen={toggleOpen}
                                    openIndex={openIndex}
                                />
                            ))
                            : collections.map((c: any, idx: number) => (
                                <CollectionEditor key={idx} collection={c} />
                            ))}
                    </div>

                )}

                {
                    activeTab === "collections" ? (<CollectionFormModal active={isMenuOpen} />) : (<QuestionFormModal active={isMenuOpen} onAddQuestion={() => { }} />)
                }




                <div className="buttons is-centered is-flex-wrap-wrap mt-4">
                    <button onClick={() => { openMenu(!isMenuOpen) }} className="button is-success mb-2 mr-2">New</button>
                </div>
            </div>
        </main>
    );
}
