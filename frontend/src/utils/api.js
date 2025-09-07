const API_URL = "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("token");
}

export async function apiGet(path) {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) throw new Error("Gagal GET");
    return await res.json();
}

export async function apiPost(path, data) {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Gagal POST");
    return await res.json();
}

export async function apiPut(path, data) {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Gagal PUT");
    return await res.json();
}

export async function apiDelete(path) {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) throw new Error("Gagal DELETE");
    return await res.json();
}
