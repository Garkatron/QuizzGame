import { Register } from "~/outh/register";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register" },
        { name: "description", content: "Register!" },
    ];
}

export default function Home() {
    return <Register />;
}
