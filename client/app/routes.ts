import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/gallery.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/quiz/singleplayer/:id", "routes/quizz.single.tsx"),
    layout("routes/outhcheck.tsx", [
        route("/user", "routes/user.tsx"),
        route("/quiz/multiplayer", "routes/quizz.multi.tsx"),
    ]),
] satisfies RouteConfig;
