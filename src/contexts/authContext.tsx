"use client"
import { PropsWithChildren, createContext, useEffect, useState } from "react";

type Context = {
    token: string | null
    loading: boolean
    setToken: (token: string) => void
}

const initialValue: Context = {
    token: null,
    loading: true,
    setToken: () => { }
}

export const AuthContext = createContext<Context>(initialValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('@access_token');

        setToken(token);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (loading)
            return;

        if (token)
            return localStorage.setItem('@access_token', token);

        return localStorage.removeItem('@access_token');
    }, [token, loading]);

    return (
        <AuthContext.Provider value={{ token, loading, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}