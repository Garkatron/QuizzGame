import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Deus Quizzes" },
    { name: "description", content: "Welcome to Deus Quizzes!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
