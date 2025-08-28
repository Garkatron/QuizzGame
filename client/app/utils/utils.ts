import { useCallback, useEffect, useState } from "react";
import { getCookie } from "~/cookie";
import type { Collection, Question } from "./owntypes";
import { Result } from "true-myth";


export function useFetch<T>(url: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Error ${res.status}`);

            const json = await res.json();
            setData(json.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}


function createAuthRequestInit(
    method: "POST" | "GET" = "POST",
    body?: any
): Result<RequestInit, string> {
    const token = getCookie("token");
    if (!token) return Result.err("Authentication token is missing");

    const init: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    if (body !== undefined && method !== "GET") {
        init.body = JSON.stringify(body);
    }

    return Result.ok(init);
}

export async function secureFetch<T = any>(
    method: "POST" | "GET" = "POST",
    url: string,
    body?: any,
): Promise<Result<T, string>> {
    const requestInitResult = createAuthRequestInit(method, body);


    if (requestInitResult.isErr) return Result.err(requestInitResult.error);

    try {
        const res = await fetch(url, requestInitResult.value);

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            const message = json?.message || `HTTP error: ${res.status}`;
            return Result.err(message);
        }

        return Result.ok(json as T);
    } catch (err) {
        return Result.err(err instanceof Error ? err.message : "Unknown error during fetch");
    }
}


export async function updateQuestion(
    qid: string,
    field: string,
    value: any
): Promise<Result<Question, string>> {
    const res = await secureFetch<{ data: Question }>("POST", "/api/question/edit", { id: qid, field, value });

    if (res.isErr) return Result.err(res.error);

    if (!res.value?.data) return Result.err("No question data received from server");

    return Result.ok(res.value.data);
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

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || `HTTP error: ${res.status}`;
        return Result.err(`Failed to update question: ${message}`);
    }

    if (!res.ok) Result.err("Failed to create question");
    return Result.ok(res.json());
}
export async function getQuestionByID(qid: string) {
    return await secureFetch("GET", `/api/questions/id/${qid}`);
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
    const res = secureFetch("POST", "/api/collection/edit", {
        collection_id: _id,
        owner_id: owner,
        questions,
        name,
        tags
    });

    return res;
}

export async function deleteCollection(owner_id: string, collection_id: string | null) {
    if (!collection_id) {
        return Result.err("Collection ID is required to delete");
    }

    return await secureFetch("POST", "/api/collection/delete", {
        owner_id,
        collection_id
    });
}


export async function createCollection(questions: Question[], tags: string[], name: string) {
    const res = await secureFetch("POST", "/api/collection/create", {
        user_name: getCookie("username"),

        questions,
        tags,
        name,
    });

    return res;
}