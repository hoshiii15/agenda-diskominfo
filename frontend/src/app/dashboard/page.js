"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiPut, API_URL } from "../../utils/api";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Calendar, MapPin, FileText, Edit, Trash2, Upload, Plus, Clock, Tag, Image, X } from "lucide-react";

function getRoleFromToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || null;
    } catch {
        return null;
    }
}

export default function DashboardPage() {
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editAgenda, setEditAgenda] = useState(null);
    const [form, setForm] = useState({ judul: "", tanggal: "", lokasi: "", deskripsi: "", kategori: "" });
    const [kategoriList, setKategoriList] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");

    const router = useRouter();
    const role = getRoleFromToken();

    useEffect(() => {
        apiGet("/agenda")
            .then((res) => {
                if (Array.isArray(res)) setAgendas(res);
                else if (Array.isArray(res.data)) setAgendas(res.data);
                else setErr("Data agenda tidak ditemukan.");
            })
            .catch(() => setErr("Gagal mengambil data agenda."))
            .finally(() => setLoading(false));

        apiGet("/kategori/public").then((res) => {
            if (Array.isArray(res.kategori)) setKategoriList(res.kategori);
            else if (Array.isArray(res)) setKategoriList(res);
        });
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = editAgenda
                ? await apiPut(`/agenda/${editAgenda._id || editAgenda.agendaId}`, form, token)
                : await apiPost("/agenda", form, token);

            const agendaData = res?.data || res;
            if (agendaData && (agendaData._id || agendaData.agendaId)) {
                setShowForm(false);
                setEditAgenda(null);
                window.location.reload();
            } else {
                alert("Gagal menyimpan agenda.");
            }
        } catch (error) {
            console.error("Error simpan agenda:", error);
            alert("Terjadi kesalahan. Coba lagi nanti.");
        }
    }

    async function handleDelete(id) {
        const token = localStorage.getItem("token");
        if (!token) return;
        if (confirm("Yakin hapus agenda ini?")) {
            await apiDelete(`/agenda/${id}`, token);
            setAgendas(agendas.filter((a) => (a._id || a.agendaId) !== id));
        }
    }

    useEffect(() => {
        if (!role) {
            router.push("/guest-dashboard");
        }
    }, [role, router]);

    return (
        <>
            {/* Main Container */}
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                {/* Content Wrapper */}
                <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Daftar Agenda</h1>
                                        <p className="text-sm text-slate-600">Dinas Komunikasi dan Informatika</p>
                                    </div>
                                </div>

                                {role === "user" && (
                                    <button
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
                                        onClick={() => {
                                            setShowForm(true);
                                            setEditAgenda(null);
                                            setForm({ judul: "", tanggal: "", lokasi: "", deskripsi: "", kategori: "" });
                                        }}
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Tambah Agenda Baru
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Form Section */}
                        {showForm && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {editAgenda ? "Edit Agenda" : "Tambah Agenda Baru"}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {editAgenda ? "Perbarui informasi agenda" : "Lengkapi formulir untuk menambah agenda baru"}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Judul */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Agenda</label>
                                        <input
                                            className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                            placeholder="Masukkan judul agenda..."
                                            required
                                            value={form.judul}
                                            onChange={(e) => setForm(f => ({ ...f, judul: e.target.value }))}
                                        />
                                    </div>

                                    {/* Tanggal & Kategori */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal & Waktu</label>
                                            <input
                                                className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                type="datetime-local"
                                                required
                                                value={form.tanggal}
                                                onChange={(e) => setForm(f => ({ ...f, tanggal: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                                            <select
                                                className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                required
                                                value={form.kategori}
                                                onChange={(e) => setForm(f => ({ ...f, kategori: e.target.value }))}
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {kategoriList.map(k => <option key={k.nama} value={k.nama}>{k.nama}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Lokasi */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi</label>
                                        <input
                                            className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                            placeholder="Masukkan lokasi agenda..."
                                            required
                                            value={form.lokasi}
                                            onChange={(e) => setForm(f => ({ ...f, lokasi: e.target.value }))}
                                        />
                                    </div>

                                    {/* Deskripsi */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                                        <textarea
                                            className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none bg-white"
                                            placeholder="Masukkan deskripsi agenda..."
                                            required
                                            value={form.deskripsi}
                                            onChange={(e) => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 sm:flex-row">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
                                        >
                                            {editAgenda ? "Simpan Perubahan" : "Tambah Agenda"}
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors duration-200"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Content Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Agenda Kegiatan</h2>
                                        <p className="mt-1 text-sm text-slate-600">Kelola dan pantau agenda kegiatan</p>
                                    </div>
                                    <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                        Total: {agendas.length} agenda
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                                        <p className="text-slate-600 font-medium">Memuat data agenda...</p>
                                    </div>
                                ) : err ? (
                                    <div className="text-center py-12">
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                            <FileText className="h-8 w-8 text-red-600" />
                                        </div>
                                        <p className="text-red-600 font-semibold text-lg">{err}</p>
                                    </div>
                                ) : agendas.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
                                            <Calendar className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Agenda</h3>
                                        <p className="text-slate-500">Mulai dengan menambahkan agenda pertama Anda</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {agendas.map((agenda) => (
                                            <div key={agenda._id || agenda.agendaId} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300">

                                                {/* Header */}
                                                <div className="flex items-start gap-3 mb-5">
                                                    <div className="bg-blue-600 text-white h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                                                        {agenda.judul?.[0]?.toUpperCase() || "A"}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2" title={agenda.judul}>
                                                            {agenda.judul}
                                                        </h3>
                                                        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                                            {agenda.kategori?.nama || agenda.kategori || "Tanpa Kategori"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-3 mb-6 text-sm">
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-slate-900 mb-1">Tanggal & Waktu:</p>
                                                            <p className="text-slate-600">{agenda.tanggal?.replace("T", " ").slice(0, 16)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-slate-900 mb-1">Lokasi:</p>
                                                            <p className="text-slate-600 break-words">{agenda.lokasi}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-slate-900 mb-1">Deskripsi:</p>
                                                            <p className="text-slate-600 break-words">{agenda.deskripsi}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                                    {agenda.dokumentasi && (
                                                        <button
                                                            onClick={() => {
                                                                setModalImageUrl(`http://localhost:5000/${agenda.dokumentasi.replace(/\\/g, "/")}`);
                                                                setShowImageModal(true);
                                                            }}
                                                            className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                                                        >
                                                            <Image className="w-4 h-4" />
                                                            Dokumentasi
                                                        </button>
                                                    )}

                                                    {role === "user" && (
                                                        <>
                                                            <button
                                                                className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                                                                onClick={() => {
                                                                    setEditAgenda(agenda);
                                                                    setForm({
                                                                        judul: agenda.judul,
                                                                        tanggal: agenda.tanggal?.slice(0, 16) || "",
                                                                        lokasi: agenda.lokasi,
                                                                        deskripsi: agenda.deskripsi,
                                                                        kategori: agenda.kategori?.nama || agenda.kategori || "",
                                                                    });
                                                                    setShowForm(true);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                Edit
                                                            </button>

                                                            <label className="inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-colors duration-200">
                                                                <Upload className="w-4 h-4" />
                                                                {agenda.dokumentasi ? "Ganti File" : "Upload"}
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (!file) return;
                                                                        const formData = new FormData();
                                                                        formData.append("file", file);
                                                                        try {
                                                                            const token = localStorage.getItem("token");
                                                                            const agendaId = agenda._id || agenda.agendaId;
                                                                            const response = await fetch(`http://localhost:5000/api/agenda/${agendaId}/ganti-dokumentasi`, {
                                                                                method: "PUT",
                                                                                headers: { Authorization: `Bearer ${token}` },
                                                                                body: formData,
                                                                            });
                                                                            if (!response.ok) throw new Error("Upload gagal");
                                                                            alert("Dokumentasi berhasil diunggah");
                                                                            window.location.reload();
                                                                        } catch (error) {
                                                                            console.error("Upload error:", error);
                                                                            alert("Gagal mengunggah dokumentasi");
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </>
                                                    )}

                                                    {role === "admin" && (
                                                        <button
                                                            className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                                                            onClick={() => handleDelete(agenda._id || agenda.agendaId)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-2"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                    <Image className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 text-lg">Dokumentasi Agenda</h3>
                            </div>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 p-6 overflow-auto">
                            <img
                                src={modalImageUrl}
                                alt="Dokumentasi Agenda"
                                className="w-full h-auto rounded-lg mx-auto shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}