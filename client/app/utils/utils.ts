import { useEffect, useState } from "react";

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
