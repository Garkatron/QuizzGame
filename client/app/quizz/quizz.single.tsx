import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Collection, Question } from "~/utils/owntypes";
import { useFetch } from "~/utils/utils";

export function SingleplayerQuizz({ id }: { id: string }) {

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [feedbackClass, setFeedbackClass] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const { data: collectionData, loading: collectionLoading, error: errorLoadingCollection, refetch: refreshCollection } = useFetch<Collection>(`/api/collections/id/${id}`);
    const [pool, setPool] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    const randomQuestionNumber = (l: number) => Math.floor(Math.random() * l);

    useEffect(() => {
        if (id === "0") {
            fetch("/api/questions")
                .then(res => res.json())
                .then(json => {
                    if (Array.isArray(json.data)) {
                        setQuestions(json.data);
                        setCurrentIndex(randomQuestionNumber(json.data.length));
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else if (collectionData) {
            setQuestions(collectionData.questions);
            setCurrentIndex(randomQuestionNumber(collectionData.questions.length));
            setLoading(false);
        }
    }, [id, collectionData]);



    const nextQuestion = () => {
        if (questions.length === 0) return;

        const remainingIndices = questions
            .map((_, idx) => idx)
            .filter(idx => !pool.includes(String(idx)));

        if (remainingIndices.length === 0) return;

        const n = remainingIndices[randomQuestionNumber(remainingIndices.length)];
        setPool([...pool, String(n)]);
        setCurrentIndex(n);
    };



    const question = questions[currentIndex];
    const isCorrect = (answer: string) => answer === question.answer;
    const checkAswer = (answer: string) => {
        setSelectedAnswer(answer);
        if (isCorrect(answer)) {
            setFeedbackClass("has-background-primary");
            setScore(score + 1);
        } else {
            setFeedbackClass("has-background-danger");
        }
        setTimeout(
            () => {
                setSelectedAnswer(null);
                nextQuestion();
            },
            1000
        );
    };

    if (pool.length === collectionData?.questions.length) {
        return (
            <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
                <h2 className="title">Congratulations, You've finished!</h2>
                <h3 className="subtitle"> Correct answers: {score} of {collectionData.questions.length} Questions</h3>
                <Link to="/" className="button is-large">
                    Exit to Gallery
                </Link>

            </main>
        )
    }

    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center" style={{
            backgroundImage: "url('/bg4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
        }}>
            {
                id && (<h1 className="subtitle">{collectionData?.name}</h1>)
            }
            <div id="box" className={`box has-text-centered ${feedbackClass}`} style={{ maxWidth: "600px", width: "100%" }}>
                {loading ? (
                    <h2 className="title is-2">Loading...</h2>
                ) : question ? (
                    <>
                        <h1 className="title is-2 mb-5">{question.question || "Random question"}</h1>
                        <br />
                        <div className="buttons is-flex is-flex-direction-column is-align-items-stretch">
                            {question.options.map((option: string, i: number) => (
                                <button disabled={!!selectedAnswer} onClick={() => checkAswer(option)} key={i} className="button is-primary is-light mb-2">
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="title is-2">No questions available</h2>

                        <Link to="/" className="button is-warning is-large">
                            Find more
                        </Link>
                    </>
                )}

            </div>
            <Link to="/" className="button is-large">
                Exit to Gallery
            </Link>

        </main>
    );
}
