"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" && localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    return <>{children}</>;
}