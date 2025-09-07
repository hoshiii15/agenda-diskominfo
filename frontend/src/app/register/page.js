"use client";
import { useState } from "react";
import { apiPost } from "../../utils/api";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, Phone, User, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", no_wa: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== confirmPassword) {
            setMsg("Kata Sandi dan konfirmasi Kata Sandi tidak cocok.");
            return;
        }

        setLoading(true);
        const res = await apiPost("/users/register", form);
        setMsg(res.message);
        setLoading(false);

        if (res.message?.toLowerCase().includes("kode verifikasi")) {
            setTimeout(() => router.push("/verify"), 1500);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-md">

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Daftar Akun Baru</h1>
                        <p className="text-sm text-slate-600">Dinas Komunikasi dan Informatika</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Pengguna</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    placeholder="Masukkan nama pengguna"
                                    required
                                    value={form.username}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                />
                            </div>
                        </div>

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

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Kata Sandi</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    placeholder="Ulangi kata sandi"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
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
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Daftar Sekarang
                                </>
                            )}
                        </button>
                    </form>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${msg.toLowerCase().includes('kode verifikasi') || msg.toLowerCase().includes('berhasil')
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                            }`}>
                            {msg.toLowerCase().includes('kode verifikasi') || msg.toLowerCase().includes('berhasil') ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <p className={`text-sm font-medium ${msg.toLowerCase().includes('kode verifikasi') || msg.toLowerCase().includes('berhasil')
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}>
                                {msg}
                            </p>
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600">
                            Sudah punya akun?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Login di sini
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
                    </p>
                </div>
            </div>
        </div>
    );
}