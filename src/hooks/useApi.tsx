"use client"
import { AuthContext } from "@/contexts/authContext";
import { useContext, useEffect, useState } from "react";

export function useAPI(url: string, config: RequestInit, lazy: boolean = false) {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [iserror, setIsError] = useState<any>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const { token, loading: loadingToken } = useContext(AuthContext);

    const refetch = async (fetchData?: any) => {
        if (loading) return null;

        try {
            const response = await fetch(url, { ...config, body: fetchData || config.body, headers: { authorization: 'Bearer ' + (token || '') } });
            if (response.status != 200)
                throw response;

            const data = await response.json();

            setData(data);
            setSuccess(true);
            setError(null);
            setIsError(false);
        }
        catch (e) {
            setError(e);
            setIsError(true);
            setData(null);
            setSuccess(false);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (lazy || loadingToken) return;

        refetch();
    }, [lazy, loadingToken]);

    return { refetch, loading, iserror, error, data, success };
}