import { SingleplayerQuizz } from "~/quizz/quizz.single";
import type { Route } from "./+types/home";
import { useParams } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quizz!" },
        { name: "description", content: "Quizz!" },
    ];
}

export default function Home() {
    const { id } = useParams<{ id: string }>();
    return <SingleplayerQuizz id={id!} />;
}
