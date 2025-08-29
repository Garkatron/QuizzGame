import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),

    route("/quiz/dashboard", "routes/dashboard.tsx"),
    route("/quiz/singleplayer/:id", "routes/quizz.single.tsx"),
    route("/quiz/multiplayer", "routes/quizz.multi.tsx"),
] satisfies RouteConfig;
