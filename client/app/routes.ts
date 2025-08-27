import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),

    route("/quizz/singleplayer", "routes/quizz.single.tsx"),
    route("/quizz/multiplayer", "routes/quizz.multi.tsx"),
] satisfies RouteConfig;
