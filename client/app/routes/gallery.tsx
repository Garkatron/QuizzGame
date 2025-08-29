import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Gallery } from "~/galery/Gallery";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quiz Gallery" },
        { name: "description", content: "Welcome to Deus Quizzes!" },
    ];
}

export default function Home() {
    return <Gallery />;
}
