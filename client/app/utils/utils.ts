import { useEffect, useState } from "react";
import { getCookie } from "~/cookie";

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