import { Link } from "react-router";

export function Welcome() {
  return (
    <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
      <div className="has-text-centered">
        <h1 className="title is-1">Deus Quizzes</h1>
        <h3 className="subtitle is-3">Test your knowledge</h3>
        <div className="buttons is-centered mt-5">
          <Link to="/quizz/singleplayer" className="button is-danger is-large">
            Singleplayer
          </Link>
          <Link to="/quizz/multiplayer" className="button is-primary is-large">
            Multiplayer
          </Link>
        </div>
      </div>
    </main>
  );
}
