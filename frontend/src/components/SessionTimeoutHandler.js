"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionTimeoutHandler() {
    const router = useRouter();

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // hapus token session dari localStorage (atau cookies sesuai implementasi)
                localStorage.removeItem("token");
                router.push("/login"); // redirect ke login
            }, 5 * 60 * 1000); // 5 menit
        };

        // pasang listener untuk aktivitas user
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);

        resetTimer(); // mulai timer pertama kali

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            clearTimeout(timeoutId);
        };
    }, [router]);

    return null; // tidak render apa-apa
}
