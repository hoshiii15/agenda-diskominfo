"use client";
import { useState } from "react";
import { apiPost } from "../../utils/api";
import { useRouter } from "next/navigation";
import { LogIn, Phone, Lock, Eye, EyeOff, AlertCircle, Users } from "lucide-react";

export default function LoginPage() {
    const [form, setForm] = useState({ no_wa: "", password: "" });
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await apiPost("/users/login", form);
            if (res.token) {
                localStorage.setItem("token", res.token);
                router.push("/dashboard");
            } else {
                setMsg(res.message || "Login Gagal");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Username atau Password salah";
            setMsg(msg);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-md">

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Masuk ke Akun</h1>
                        <p className="text-sm text-slate-600">Dinas Komunikasi dan Informatika</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* WhatsApp Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor WhatsApp</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    placeholder="Contoh: 08123456789"
                                    required
                                    value={form.no_wa}
                                    onChange={e => setForm(f => ({ ...f, no_wa: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    placeholder="Masukkan kata sandi"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Masuk Sekarang
                        </button>
                    </form>

                    {/* Message Display */}
                    {msg && (
                        <div className="mt-6 p-4 rounded-lg flex items-center gap-3 bg-red-50 border border-red-200">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-red-700">
                                {msg}
                            </p>
                        </div>
                    )}

                    {/* Additional Links */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">

                        {/* Forgot Password */}
                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                Lupa kata sandi?{" "}
                                <a
                                    href="/forgot-password"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Ganti di sini
                                </a>
                            </p>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                Belum punya akun?{" "}
                                <a
                                    href="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Daftar sekarang
                                </a>
                            </p>
                        </div>

                        {/* Guest Access */}
                        <div className="pt-4 border-t border-slate-100">
                            <a
                                href="/guest-dashboard"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-200"
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Masuk sebagai Tamu</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Dengan masuk, Anda menyetujui syarat dan ketentuan yang berlaku
                    </p>
                </div>
            </div>
        </div>
    );
}