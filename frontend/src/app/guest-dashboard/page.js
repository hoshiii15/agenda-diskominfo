"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";
import Navbar from "../../components/Navbar";
import { Calendar, MapPin, FileText, Image, Clock, Tag, X, Eye } from "lucide-react";

export default function GuestDashboardPage() {
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");

    useEffect(() => {
        apiGet("/agenda")
            .then((res) => {
                if (Array.isArray(res)) setAgendas(res);
                else if (Array.isArray(res.data)) setAgendas(res.data);
                else setErr("Data agenda tidak ditemukan.");
            })
            .catch(() => setErr("Gagal mengambil data agenda."))
            .finally(() => setLoading(false));
    }, []);

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
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Daftar Agenda</h1>
                                    <p className="text-sm text-slate-600">Dinas Komunikasi dan Informatika - Portal Publik</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Agenda Kegiatan Publik</h2>
                                        <p className="mt-1 text-sm text-slate-600">Informasi jadwal kegiatan yang dapat diakses publik</p>
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
                                        <p className="text-slate-500">Tidak ada agenda yang tersedia saat ini</p>
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

                                                {/* Documentation Button */}
                                                {agenda.dokumentasi && (
                                                    <div className="pt-4 border-t border-slate-200">
                                                        <button
                                                            onClick={() => {
                                                                setModalImageUrl(`http://localhost:5000/${agenda.dokumentasi.replace(/\\/g, "/")}`);
                                                                setShowImageModal(true);
                                                            }}
                                                            className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 w-full justify-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Lihat Dokumentasi
                                                        </button>
                                                    </div>
                                                )}
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