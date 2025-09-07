'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api";
import Navbar from "../../components/Navbar";
import { Settings, Users, Tag, Plus, Edit, Trash2, Save, X, Shield } from "lucide-react";

function getRoleFromToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role;
    } catch (err) {
        return null;
    }
}

export default function AdminDashboard() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [kategoris, setKategoris] = useState([]);

    const [kategoriBaru, setKategoriBaru] = useState({ nama: "", deskripsi: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ nama: "", deskripsi: "" });

    useEffect(() => {
        const role = getRoleFromToken();
        if (role !== "admin") {
            router.push("/dashboard");
            return;
        }
        fetchUsers();
        fetchKategoris();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await apiGet("/users");
            setUsers(res);
        } catch (err) {
            console.error("Gagal ambil data users", err);
        }
    };

    const handleSetKategori = async (username, kategori) => {
        try {
            await apiPost("/users/set-kategori", { username, kategori });
            fetchUsers();
        } catch (err) {
            alert("Gagal set kategori");
        }
    };

    const handleDeleteUser = async (no_wa) => {
        if (!confirm("Yakin hapus user ini?")) return;
        try {
            await apiDelete(`/users/${no_wa}`);
            fetchUsers();
        } catch (err) {
            alert("Gagal hapus user");
        }
    };

    const fetchKategoris = async () => {
        try {
            const data = await apiGet("/kategori");
            setKategoris(data.kategori);
        } catch (error) {
            console.error("Gagal fetch kategori:", error);
            setKategoris([]);
        }
    };

    const handleTambahKategori = async () => {
        try {
            await apiPost("/kategori", kategoriBaru);
            setKategoriBaru({ nama: "", deskripsi: "" });
            fetchKategoris();
        } catch (err) {
            alert("Gagal tambah kategori");
        }
    };

    const handleDeleteKategori = async (nama) => {
        if (!confirm("Yakin hapus kategori ini?")) return;
        try {
            await apiDelete(`/kategori/${nama}`);
            fetchKategoris();
        } catch (err) {
            alert("Gagal hapus kategori");
        }
    };

    const startEditKategori = (index, nama, deskripsi) => {
        setEditIndex(index);
        setEditData({ nama, deskripsi });
    };

    const handleSaveEdit = async (namaLama) => {
        if (!editData.nama.trim()) {
            alert("Nama kategori tidak boleh kosong");
            return;
        }
        try {
            await apiPut(`/kategori/${encodeURIComponent(namaLama)}`, {
                newNama: editData.nama.trim(),
                newDeskripsi: editData.deskripsi.trim(),
            });
            setEditIndex(null);
            setEditData({ nama: "", deskripsi: "" });
            fetchKategoris();
            alert("Kategori berhasil diperbarui!");
        } catch (err) {
            alert("Gagal memperbarui kategori");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Content Wrapper */}
            <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Admin</h1>
                                <p className="text-sm text-slate-600">Kelola pengguna dan kategori sistem</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Category Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                                    <Plus className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">Tambah Kategori Baru</h3>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">Buat kategori baru untuk mengorganisir agenda</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Kategori</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama kategori..."
                                        className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        value={kategoriBaru.nama}
                                        onChange={(e) => setKategoriBaru({ ...kategoriBaru, nama: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan deskripsi kategori..."
                                        className="w-full border border-slate-300 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        value={kategoriBaru.deskripsi}
                                        onChange={(e) => setKategoriBaru({ ...kategoriBaru, deskripsi: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleTambahKategori}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Tambah Kategori
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                                        <Tag className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Daftar Kategori</h2>
                                        <p className="mt-1 text-sm text-slate-600">Kelola kategori untuk agenda kegiatan</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                    Total: {kategoris.length} kategori
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {kategoris.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
                                        <Tag className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Kategori</h3>
                                    <p className="text-slate-500">Tambahkan kategori pertama untuk memulai</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">Nama Kategori</th>
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">Deskripsi</th>
                                                <th className="text-center py-4 px-4 font-semibold text-slate-900">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kategoris.map((k, i) => (
                                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                                    <td className="py-4 px-4">
                                                        {editIndex === i ? (
                                                            <input
                                                                type="text"
                                                                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                                value={editData.nama}
                                                                onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
                                                            />
                                                        ) : (
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <span className="font-medium text-slate-900">{k.nama}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {editIndex === i ? (
                                                            <input
                                                                type="text"
                                                                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                                value={editData.deskripsi}
                                                                onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}
                                                            />
                                                        ) : (
                                                            <span className="text-slate-600 italic">{k.deskripsi}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            {editIndex === i ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleSaveEdit(k.nama)}
                                                                        className="inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                                                                    >
                                                                        <Save className="w-4 h-4" />
                                                                        Simpan
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditIndex(null)}
                                                                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                        Batal
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => startEditKategori(i, k.nama, k.deskripsi)}
                                                                        className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteKategori(k.nama)}
                                                                        className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Hapus
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Manajemen Pengguna</h2>
                                        <p className="mt-1 text-sm text-slate-600">Kelola pengguna sistem dan assign kategori</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                    Total: {users.length} pengguna
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {users.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
                                        <Users className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Pengguna</h3>
                                    <p className="text-slate-500">Pengguna akan muncul setelah mendaftar</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">Pengguna</th>
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">No. WhatsApp</th>
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">Role</th>
                                                <th className="text-left py-4 px-4 font-semibold text-slate-900">Kategori</th>
                                                <th className="text-center py-4 px-4 font-semibold text-slate-900">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg font-bold text-sm">
                                                                {u.username?.[0]?.toUpperCase() || "U"}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-slate-900">{u.username}</div>
                                                                <div className="text-sm text-slate-500">Pengguna sistem</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="font-mono text-slate-800">{u.no_wa}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <select
                                                            value={u.kategori || ""}
                                                            onChange={(e) => handleSetKategori(u.username, e.target.value)}
                                                            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                        >
                                                            <option value="">-- Pilih Kategori --</option>
                                                            {kategoris.map((k, i) => (
                                                                <option key={i} value={k.nama}>
                                                                    {k.nama}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleDeleteUser(u.no_wa)}
                                                                className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}