import type { Route } from "./+types/home";
import { Dashboard } from "~/dashboard/editor";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quiz Dashboard" },
        { name: "description", content: "Welcome to Deus Quizzes!" },
    ];
}

export default function Home() {
    return <Dashboard />;
}
