import { useEffect, useState } from "react";
import { getCookie } from "~/cookie";
import type { Collection } from "./owntypes";

export function useFetch<T>(url: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;
        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then((json) => { setData(json.data) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
}


export async function updateQuestion(qid: string, field: string, value: any) {
    const res = await fetch("/api/question/edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
            id: qid,
            field,
            value,
        }),
    });
    if (!res.ok) throw new Error("Failed to update question");
    return res.json();

}

export async function createQuestion(question: string, tags: string[], options: string[], answer: string) {
    const res = await fetch("/api/question/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
            user_name: getCookie("username"),
            question_text: question,
            options,
            answer,
            tags
        }),
    });
    if (!res.ok) throw new Error("Failed to create question");
    return res.json();
}
export async function addQuestionByID(qid: string) {
    try {
        const res = await fetch(`/api/questions/id/${qid}`);

        if (!res.ok) {
            throw new Error("Failed to fetch question");
        }

        const json = await res.json();

        if (!json.data) {
            throw new Error("No question data received");
        }

        return json.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function addCollectionByID(qid: string) {
    try {
        const res = await fetch(`/api/collections/id/${qid}`);

        if (!res.ok) {
            throw new Error("Failed to fetch collection");
        }

        const json = await res.json();

        if (!json.data) {
            throw new Error("No collection data received");
        }

        return json.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateCollection({ _id, name, tags, owner, questions }: Collection) {
    const res = await fetch("/api/collection/edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(
            {
                collection_id: _id,
                owner_id: owner,
                questions,
                name,
                tags
            }
        ),
    });

    const data = await res.json();
    if (!data.success) {
        console.error(data);
        return;
    }
    return data;
}

export async function deleteCollection(owner_id: string, collection_id: string | null) {
    try {
        const res = await fetch("/api/collection/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
                owner_id: owner_id,
                collection_id: collection_id
            }),
        });
        const data = await res.json();
        if (!data.success) {
            console.error(data);
            return;
        }
        return data;
    } catch (err) {
        console.log(err);
    }
}