"use client";
import { useState } from "react";
import { apiPost } from "../../utils/api";
import { useRouter } from "next/navigation";
import { ShieldCheck, Phone, Key, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function VerifyPage() {
    const [form, setForm] = useState({ no_wa: "", kodeVerifikasi: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const res = await apiPost("/users/verify", form);
        setMsg(res.message);
        setLoading(false);

        if (res.message?.toLowerCase().includes("berhasil")) {
            setTimeout(() => router.push("/login"), 1500);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-md">

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifikasi Akun</h1>
                        <p className="text-sm text-slate-600">Masukkan kode verifikasi yang telah dikirim ke WhatsApp Anda</p>
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
                                    placeholder="Nomor WhatsApp yang didaftarkan"
                                    required
                                    value={form.no_wa}
                                    onChange={e => setForm(f => ({ ...f, no_wa: e.target.value }))}
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Masukkan nomor yang sama dengan saat pendaftaran</p>
                        </div>

                        {/* Verification Code Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kode Verifikasi</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-mono text-center tracking-widest"
                                    placeholder="Masukkan 6 digit kode"
                                    required
                                    maxLength="6"
                                    value={form.kodeVerifikasi}
                                    onChange={e => setForm(f => ({ ...f, kodeVerifikasi: e.target.value.replace(/\D/g, '') }))}
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Kode verifikasi 6 digit yang dikirim via WhatsApp</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Memverifikasi...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Verifikasi Sekarang
                                </>
                            )}
                        </button>
                    </form>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${msg.toLowerCase().includes('berhasil')
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-red-50 border border-red-200'
                            }`}>
                            {msg.toLowerCase().includes('berhasil') ? (
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${msg.toLowerCase().includes('berhasil')
                                        ? 'text-blue-700'
                                        : 'text-red-700'
                                    }`}>
                                    {msg}
                                </p>
                                {msg.toLowerCase().includes('berhasil') && (
                                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-1" />
                                        Mengarahkan ke halaman login...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Register Link */}
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
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
                </div>

                {/* Help Card */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
                            <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 text-sm mb-1">Tidak menerima kode?</h3>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Periksa pesan WhatsApp Anda atau coba daftar ulang jika kode tidak diterima dalam 5 menit.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Kode verifikasi berlaku selama 10 menit setelah dikirim
                    </p>
                </div>
            </div>
        </div>
    );
}