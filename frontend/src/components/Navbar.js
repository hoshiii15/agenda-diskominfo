"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Home, Settings, LogOut, LogIn, Menu, X } from "lucide-react";

function getRoleFromToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (err) {
        return null;
    }
}

export default function Navbar() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [hasToken, setHasToken] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token); // true jika ada token
        const userRole = getRoleFromToken();
        setRole(userRole);
    }, []);

    return (
        <nav className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push("/dashboard")}
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="currentColor" className="text-white" />
                                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
                            </svg>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Agenda<span className="text-blue-600">App</span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {role === "admin" && (
                            <a
                                href="/dashboard-admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                <Settings className="w-4 h-4" />
                                Dashboard Admin
                            </a>
                        )}
                        <a
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </a>
                        <a
                            href="/calendar.html"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Calendar className="w-4 h-4" />
                            Kalender
                        </a>

                        <div className="ml-4 pl-4 border-l border-slate-200">
                            {hasToken ? (
                                <button
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium border border-slate-300 hover:border-slate-400 transition-all duration-200"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        router.push("/login");
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                                    onClick={() => router.push("/login")}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {role === "admin" && (
                            <a
                                href="/dashboard-admin"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                <Settings className="w-5 h-5" />
                                Dashboard Admin
                            </a>
                        )}
                        <a
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </a>
                        <a
                            href="/calendar.html"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Calendar className="w-5 h-5" />
                            Kalender
                        </a>

                        <div className="pt-3 mt-3 border-t border-slate-200">
                            {hasToken ? (
                                <button
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 hover:border-slate-400 transition-all duration-200"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        router.push("/login");
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    onClick={() => {
                                        router.push("/login");
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}