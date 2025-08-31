import { scrollToElement, useFetch } from "~/utils/utils";
import { CollectionGalleryItem } from "./CollectionGalleryItem";
import type { Collection, Question, User } from "~/utils/owntypes";
import { useEffect, useMemo, useState } from "react";
import "./custom.css";
import { QuestionGalleryItem } from "~/dashboard/question/QuestionGalleryItem";
import { useUser } from "~/utils/UserContext";
import { UserGalleryItem } from "~/dashboard/UserGalleryItem";
import { CollectionFormModal } from "~/dashboard/collection/CollectionFormModal";
import { QuestionFormModal } from "~/dashboard/question/QuestionFormModal";
import { Link, useNavigate } from "react-router";
import { getCookie } from "~/cookie";

export function Gallery() {

    const { user, hasPermission, hasPermissions } = useUser();
    const [offsetY, setOffsetY] = useState(0);

    // Listener para scroll
    const handleScroll = () => {
        setOffsetY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        // cleanup cuando el componente se desmonta
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const { data: collections, loading: isLoadingCollections, error: errorWithCollections, refetch: refreshCollections } =
        useFetch<Collection[]>("/api/collections");


    const { data: questions, loading: isLoadingQuestions, error: errorWithQuestions, refetch: refreshQuestions } =
        useFetch<Question[]>("/api/questions");

    const { data: users, loading: isLoadingUsers, error: errorWithUsers, refetch: refreshUsers } =
        useFetch<User[]>("/api/users");

    const [activeTab, setActiveTab] = useState<"questions" | "collections" | "users">("collections");

    const [isMenuOpen, openMenu] = useState(false);


    const [search, setSearch] = useState("");

    let name = "Quiz Finder";
    if (activeTab === "collections") {
        name = "Quiz Finder";
    } else if (activeTab === "questions") {
        name = "Question Finder";
    } else {
        name = "User Finder";
    }

    let buttonName = "New";
    if (activeTab === "collections") {
        buttonName = "New Quiz";
    } else if (activeTab === "questions") {
        buttonName = "New Question";
    } else {
        buttonName = "New User";
    }

    const filteredCollections = useMemo(() => {
        if (!collections) return [];
        const term = search.trim().toLowerCase();
        return collections.filter(c => c.name.toLowerCase().includes(term));
    }, [collections, search]);

    const collectionsContent = filteredCollections.map((collection) => {
        const editable = hasPermission("ADMIN") || (hasPermission("EDIT_COLLECTION") && collection.owner === user?._id);

        return (
            <CollectionGalleryItem
                key={collection._id}
                collection={collection}
                editable={editable}
                onUpdate={refreshCollections}
            />
        );
    });

    const filteredQuestions = useMemo(() => {
        if (!questions) return [];
        const term = search.trim().toLowerCase();
        return questions.filter(q => q.question.toLowerCase().includes(term));
    }, [questions, search]);
    const questionsContent = filteredQuestions.map((question) => {
        const editable = hasPermission("ADMIN") || (hasPermission("EDIT_COLLECTION") && question.owner === user?._id);


        return (
            <QuestionGalleryItem
                key={question._id}
                question={question}
                editable={editable}
                onUpdate={refreshQuestions}
            />
        );
    });

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const term = search.trim().toLowerCase();
        return users.filter(u => u.name.toLowerCase().includes(term));
    }, [users, search]);

    const usersContent = filteredUsers.map((luser, key) => (
        <UserGalleryItem key={luser.name} user={luser} editable={hasPermission("EDIT_USER") && user?._id === luser._id} onUpdate={refreshUsers} />
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

            <section className="paralax">
                <img src="/bg4.png" alt="" className="background" style={{ transform: `translateX(${offsetY * -4.25}px)` }} />
                <div className="paralax-content" style={{ transform: `translateY(${offsetY * 0.6}px)` }}>
                    <h1 className="title is-1">Deus Quizzes</h1>
                    <h3 className="subtitle is-3">Test your knowledge</h3>
                    <div className="buttons is-centered mt-5">
                        <button className="button" onClick={() => scrollToElement("#title")}>
                            Find Quizzes
                        </button>
                    </div>
                </div>
            </section>




            <section className="has-background-black-bis" style={{
                position: "relative",
                zIndex: 10,


            }}>
                <div className="hero is-small is-primary has-text-centered p-5">
                    {user?.name ? (
                        <Link to="/user"
                            className="button"
                            style={{
                                position: "absolute",
                                top: "1rem",
                                right: "1rem"
                            }}
                        >
                            {user.name}
                        </Link>
                    ) : (
                        <Link to="/login"
                            className="button"
                            style={{
                                position: "absolute",
                                top: "1rem",
                                right: "1rem"
                            }}
                        >
                            Login
                        </Link>
                    )
                    }

                    <h1 id="title" className="title is-2 mb-4">
                        {
                            name
                        }
                    </h1>
                    <h2 className="subtitle is-4 mb-5">Search quizzes and questions</h2>

                    <nav className="panel" >
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
                                {
                                    hasPermission("ADMIN") && (<li className={activeTab === "users" ? "is-active" : ""}><a onClick={() => setActiveTab("users")}>Users</a></li>)
                                }
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="columns is-multiline is-variable is-3 px-5" style={{ minHeight: "80vh" }}>
                    {renderContent()}
                    {
                        user && (
                            <div className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
                                <div className="is-flex is-justify-content-space-between is-align-items-center p-2">
                                    <button className="button is-success" onClick={() => { openMenu(true) }}>
                                        {
                                            buttonName
                                        }
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
                <CollectionFormModal active={activeTab == "collections" && isMenuOpen} id={null} onClose={() => { openMenu(false); refreshCollections() }} />
                <QuestionFormModal active={activeTab == "questions" && isMenuOpen} onAddQuestion={() => { openMenu(false); refreshQuestions(); }} />
            </section>
        </main>

    );
}