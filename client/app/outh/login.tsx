export function Login() {
    return (
        <main className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="box" style={{ width: "400px" }}>
                <h1 className="title is-2 has-text-centered mb-5">Login</h1>

                <form>
                    {/* Email */}
                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    {/* Button */}
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
