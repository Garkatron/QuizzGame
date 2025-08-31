import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { setCookie } from "~/cookie"; // si quieres guardar token
import { useUser } from "~/utils/UserContext";

export function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useUser();
    const location = useLocation();
    const from = location.state?.from || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password }),
            });

            const json = await res.json();

            if (json.success) {
                setCookie("token", json.data.accessToken);
                login(json.data.user);

                navigate(from, { replace: true });

            } else {
                setError(json.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Error connecting to server");
        }
    };

    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="box" style={{ width: "400px" }}>
                <h1 className="title is-2 has-text-centered mb-5">Login</h1>

                {error && <p className="has-text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                placeholder="Enter your username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <div className="field mt-5">
                        <div className="control">
                            <button type="submit" className="button is-primary is-fullwidth">
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
