import { useState } from "react";
import { Link } from "react-router";
import { useUser } from "~/utils/UserContext";
import { deleteUser, updateUser } from "~/utils/utils";

export function User() {
    const { user, logout } = useUser();

    if (!user) {
        return (
            <section className="content has-text-centered py-6">
                <p className="title is-4">No user logged in</p>
            </section>
        );
    }

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email || "");
    const [password, setPassword] = useState("");

    const activePermissions = Object.entries(user.permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key);

    const handleSave = async () => {
        const res = await updateUser(user,
            name.trim() !== "" ? name : null,
            email.trim() !== "" ? email : null,
            password.trim() !== "" ? password : null
        );
        if (res.isErr) {
            alert(res.error);
        }
    };

    const handleDelete = async () => {
        const res = await deleteUser(user.name);
        if (res.isErr) {
            alert(res.error);
        }
        logout();
    }

    return (
        <section className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div id="box" className="box has-text-centered" style={{ maxWidth: "600px", width: "100%" }}>
                <h1 className="title is-1 is-capitalized">{user.name}</h1>

                {activePermissions.length ? (
                    <div className="tags mt-4 is-justify-content-center">
                        {activePermissions.map((perm) => (
                            <span key={perm} className="tag is-info is-light">
                                {perm}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="subtitle is-6 mt-2">No permissions assigned</p>
                )}

                <hr />

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
                            <i className="fas fa-user"></i>
                        </span>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                        <input
                            className="input"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                        <span className="icon is-small is-left">
                            <i className="fas fa-lock"></i>
                        </span>
                    </div>
                </div>

                <div className="buttons mt-4 is-flex is-flex-direction-column">
                    <button type="button" className="button is-primary mb-2 is-fullwidth" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="button is-danger is-fullwidth" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>

            <Link to="/" className="button is-large mt-5">
                Exit to Gallery
            </Link>
        </section>
    );
}
