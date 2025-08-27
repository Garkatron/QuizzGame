import { SingleplayerQuizz } from "~/quizz/quizz.single";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quizz!" },
        { name: "description", content: "Quizz!" },
    ];
}

export default function Home() {
    return <SingleplayerQuizz />;
}
