import { useState, useEffect } from "react";

export function SingleplayerQuizz() {

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [feedbackClass, setFeedbackClass] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const randomQuestionNumber = (l: number) => Math.floor(Math.random() * l);

    useEffect(() => {
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
    }, []);


    const nextQuestion = () => {
        if (questions.length > 0) {
            setCurrentIndex(randomQuestionNumber(questions.length));
        }
    };


    const question = questions[currentIndex];
    const isCorrect = (answer: string) => answer === question.answer;
    const checkAswer = (answer: string) => {
        setSelectedAnswer(answer);
        if (isCorrect(answer)) {
            setFeedbackClass("has-background-primary");
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

    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div id="box" className={`box has-text-centered ${feedbackClass}`} style={{ maxWidth: "600px", width: "100%" }}>
                {loading ? (
                    <h2 className="title is-2">Loading...</h2>
                ) : question ? (
                    <>
                        <h1 className="title is-2 mb-5">{question.question || "Pregunta aleatoria"}</h1>
                        <div className="buttons is-flex is-flex-direction-column is-align-items-stretch">
                            {question.options.map((option: string, i: number) => (
                                <button disabled={!!selectedAnswer} onClick={() => checkAswer(option)} key={i} className="button is-primary is-light mb-2">
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <h2 className="title is-2">No questions available</h2>
                )}
            </div>
        </main>
    );
}
