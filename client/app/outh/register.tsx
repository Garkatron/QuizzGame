import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "~/utils/utils";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const res = await registerUser(name, email, password);
        if (res.isErr) {
            alert(res.error);
        } else {
            navigate("/login");
        }
    }
    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="box" style={{ width: "400px" }}>
                <h1 className="title is-2 has-text-centered mb-5">Register</h1>

                <form onSubmit={handleRegister}>
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Enter your name"
                                required
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
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
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <div className="field mt-5">
                        <div className="control">
                            <button type="submit" className="button is-primary is-fullwidth">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
