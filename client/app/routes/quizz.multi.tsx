import type { Route } from "./+types/home";
import { MultiplayerQuizz } from "~/quizz/quizz.multi";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quizz!" },
        { name: "description", content: "Quizz!" },
    ];
}

export default function Home() {
    return <MultiplayerQuizz />;
}
