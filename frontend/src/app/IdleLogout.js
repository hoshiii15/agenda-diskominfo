"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IdleLogout() {
    const router = useRouter();

    useEffect(() => {
        let idleTimer;
        const idleLimit = 5 * 60 * 1000; // 5 menit

        const logout = () => {
            localStorage.removeItem("token"); // hapus token
            router.push("/login"); // redirect ke login
        };

        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(logout, idleLimit);
        };

        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            clearTimeout(idleTimer);
        };
    }, [router]);

    return null; // tidak render apa-apa
}
