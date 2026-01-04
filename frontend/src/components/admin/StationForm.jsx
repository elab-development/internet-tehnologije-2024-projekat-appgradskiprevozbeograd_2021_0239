import React, { useState } from "react";
import axiosClient from "../../axios-client.js";

export default function StationForm({ onClose, onAddSuccess }) {
    const [form, setForm] = useState({ name: "", address: "", stop_code: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        // clear field error as user types
        setFieldErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        // client-side validation (backend traži stop_code kao required)
        if (!form.name || !form.address || !form.stop_code) {
            const errs = {};
            if (!form.name) errs.name = ['Naziv je obavezan.'];
            if (!form.address) errs.address = ['Adresa je obavezna.'];
            if (!form.stop_code) errs.stop_code = ['Kod stanice (stop_code) je obavezan.'];
            setFieldErrors(errs);
            setError("Popunite obavezna polja.");
            return;
        }

        setLoading(true);
        try {
            // Pošalji tačno polje koje backend očekuje
            const payload = {
                name: form.name,
                address: form.address,
                // pošalji vrednost direktno (ne null)
                stop_code: form.stop_code,
                // ako imaš lat/lng iz geokodiranja, možeš ih dodati ovde:
                // lat: form.lat || null, lng: form.lng || null
            };

            const res = await axiosClient.post("/station/add", payload);
            console.log("station create response:", res.data);
            onAddSuccess?.();
            onClose();
        } catch (err) {
            console.error("Station create error (full):", err);

            // Network / CORS
            if (!err.response) {
                setError("Network error: proverite konekciju / CORS.");
                setLoading(false);
                return;
            }

            // axios returns response.data — ponekad backend vraća JSON string, pa pokušamo parse
            const respData = typeof err.response.data === 'string'
                ? (() => {
                    try { return JSON.parse(err.response.data); } catch (_) { return { message: err.response.data }; }
                })()
                : err.response.data;

            // Laravel validation: respData.errors je objekat polja -> niz poruka
            if (respData && respData.errors) {
                setFieldErrors(respData.errors);
                setError("Proverite polja (validation errors).");
            } else if (respData && respData.message) {
                setError(respData.message);
            } else {
                setError(`Greška: ${err.response.status} ${err.response.statusText}`);
            }

            // debug: ostavi u konzoli kompletan odgovor
            console.log("Full response body:", respData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Dodaj stanicu</h2>

            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 8, borderRadius: 6, marginBottom: 8 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <label>Naziv stanice</label>
                <input name="name" value={form.name} onChange={handleChange} />
                {fieldErrors.name && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.name.join(', ')}</div>}

                <label>Adresa</label>
                <input name="address" value={form.address} onChange={handleChange} />
                {fieldErrors.address && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.address.join(', ')}</div>}

                <label>Kod (stop_code)</label>
                <input name="stop_code" value={form.stop_code} onChange={handleChange} />
                {fieldErrors.stop_code && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.stop_code.join(', ')}</div>}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                    <button type="button" onClick={onClose}>Otkaži</button>
                    <button type="submit" disabled={loading} style={{ background: "#A855F7", color: "white" }}>{loading ? "Sačuvaj..." : "Sačuvaj"}</button>
                </div>
            </form>
        </div>
    );
}