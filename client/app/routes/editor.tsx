import type { Route } from "./+types/home";
import { Editor } from "~/editor/editor";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Deus Quizzes" },
        { name: "description", content: "Welcome to Deus Quizzes!" },
    ];
}

export default function Home() {
    return <Editor />;
}
