import { useState } from "react";
import type { User } from "~/utils/owntypes";
import { useUser } from "~/utils/UserContext";
import { deleteUser } from "~/utils/utils";

type UserGalleryItemProps = {
    user: User;
    editable: boolean;
    onUpdate: () => void;
};

export function UserGalleryItem({ user, editable = false, onUpdate }: UserGalleryItemProps) {
    const [active, setActive] = useState<boolean>(false);

    const handleDelete = async () => {
        const res = await deleteUser(user.name);
        onUpdate();
        if (res.isErr) {
            alert(res.error);
        }
    }

    return (
        <div className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
            {/* Header */}
            <div
                className="is-flex is-justify-content-space-between is-align-items-center p-2"
                style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #eaeaea",
                }}
                onClick={() => setActive(!active)}
            >
                <span
                    className="input is-size-5 has-text-weight-semibold"
                    style={{ border: "none", boxShadow: "none" }}
                >{user.name}</span>
                <span className="icon">
                    <i className={`fas ${active ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                </span>
            </div>


            {/* Opctions */}
            <div className={`mt-3 transition-all ${active ? "is-block" : "is-hidden"}`}>

                {/** Button */}
                {
                    editable ? (
                        <button
                            className="button is-danger is-fullwidth mt-3"
                            type="button" onClick={handleDelete}
                        >
                            Delete
                        </button>
                    ) : (
                        <></>
                    )
                }
            </div>
        </div>
    )
}