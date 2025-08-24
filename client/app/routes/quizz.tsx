import type { Route } from "./+types/home";
import { Quizz } from "~/quizz/quizz";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quizz!" },
        { name: "description", content: "Quizz!" },
    ];
}

export default function Home() {
    return <Quizz />;
}
