import { User } from "~/user/user";
import type { Route } from "./+types/home";
import { Gallery } from "~/galery/gallery";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quiz Gallery" },
        { name: "description", content: "Welcome to Deus Quizzes!" },
    ];
}

export default function Home() {
    return <User />;
}
