import { Link } from "react-router";

export function MultiplayerQuizz() {
    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="box has-text-centered" style={{ maxWidth: "600px", width: "100%" }}>
                {/* Pregunta */}
                <h1 className="title is-2 mb-5">What is the capital of France?</h1>

                {/* Opciones */}
                <div className="buttons is-flex is-flex-direction-column is-align-items-stretch">
                    <button className="button is-primary is-light mb-2">Paris</button>
                    <button className="button is-link is-light mb-2">Madrid</button>
                    <button className="button is-info is-light mb-2">Berlin</button>
                    <button className="button is-warning is-light mb-2">Rome</button>
                    <button className="button is-danger is-light">Lisbon</button>
                </div>

                {

                }

            </div>
        </main>
    );
}
