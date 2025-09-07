"use client";
import { useState } from "react";
import { apiPost } from "../../utils/api";
import { useRouter } from "next/navigation";
import { Key, Phone, Send, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [noWa, setNoWa] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiPost("/users/forgot-password", { no_wa: noWa });
        if (res.message?.includes("Kode")) {
            router.push(`/reset-password?no_wa=${noWa}`);
        } else {
            setMsg(res.message || "Gagal mengirim kode.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-md">

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4">
                            <Key className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Lupa Kata Sandi</h1>
                        <p className="text-sm text-slate-600">Masukkan nomor WhatsApp untuk menerima kode verifikasi</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="space-y-6">

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
                                    value={noWa}
                                    onChange={(e) => setNoWa(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Kode verifikasi akan dikirim ke nomor WhatsApp ini
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Kirim Kode Verifikasi
                        </button>
                    </div>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${msg.includes("Kode") || msg.toLowerCase().includes("berhasil")
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                            }`}>
                            {msg.includes("Kode") || msg.toLowerCase().includes("berhasil") ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <p className={`text-sm font-medium ${msg.includes("Kode") || msg.toLowerCase().includes("berhasil")
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}>
                                {msg}
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600">
                            Ingat kata sandi Anda?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
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
                        Pastikan nomor WhatsApp yang Anda masukkan masih aktif dan dapat menerima pesan
                    </p>
                </div>
            </div>
        </div>
    );
}