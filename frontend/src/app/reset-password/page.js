"use client";
import { useState, useEffect } from "react";
import { apiPost } from "../../utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const [kode, setKode] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [noWa, setNoWa] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const wa = searchParams.get("no_wa");
        if (wa) setNoWa(wa);
    }, [searchParams]);

    const handleReset = async (e) => {
        e.preventDefault();
        const res = await apiPost("/users/reset-password", {
            no_wa: noWa,
            kodeVerifikasi: kode,
            newPassword: password,
        });

        if (res.message?.includes("berhasil")) {
            router.push("/login");
        } else {
            setMsg(res.message || "Gagal reset password.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-md">

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Kata Sandi</h1>
                        <p className="text-sm text-slate-600">Masukkan kode verifikasi dan kata sandi baru</p>
                        {noWa && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                                <Shield className="w-3 h-3" />
                                {noWa}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="space-y-6">

                        {/* Verification Code Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kode Verifikasi</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-center tracking-wider"
                                    placeholder="Masukkan kode 6 digit"
                                    required
                                    value={kode}
                                    onChange={(e) => setKode(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Kode verifikasi telah dikirim ke WhatsApp Anda
                            </p>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi Baru</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    placeholder="Masukkan kata sandi baru"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Gunakan kombinasi huruf, angka, dan karakter khusus
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <KeyRound className="w-5 h-5 mr-2" />
                            Ganti Kata Sandi
                        </button>
                    </div>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${msg.toLowerCase().includes("berhasil")
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-red-50 border border-red-200'
                            }`}>
                            {msg.toLowerCase().includes("berhasil") ? (
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <p className={`text-sm font-medium ${msg.toLowerCase().includes("berhasil")
                                    ? 'text-blue-700'
                                    : 'text-red-700'
                                }`}>
                                {msg}
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600">
                            Tidak menerima kode?{" "}
                            <a
                                href="/forgot-password"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Kirim ulang
                            </a>
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                            <a
                                href="/login"
                                className="font-semibold text-slate-600 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Setelah berhasil reset, Anda akan diarahkan ke halaman login
                    </p>
                </div>
            </div>
        </div>
    );
}