"use client"

import { AuthContext } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import React, { useContext, useEffect } from "react"

export function protectPage(Page: React.FunctionComponent<any>) {
    return (props: any[]) => {
        const { token, loading } = useContext(AuthContext);

        useEffect(() => {
            if (loading) return;

            if (!token) return redirect('/entrar');
        }, [token, loading]);

        if (!token)
            return null;

        return (
            <Page {...props} />
        );
    }
}