import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useUser } from "~/utils/UserContext";

export default function OuthCheckLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [user, navigate, location]);

    return (
        <Outlet />
    );
}