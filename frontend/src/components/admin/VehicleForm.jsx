import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";

export default function VehicleForm({ onClose, onAddSuccess }) {
    const [form, setForm] = useState({
        vehicle_code: "",
        line_id: "",
        type: "bus",
        active: 1,
    });

    const [lines, setLines] = useState([]);
    const [loadingLines, setLoadingLines] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        loadLines();
    }, []);

    async function loadLines() {
        try {
            setLoadingLines(true);
            const res = await axiosClient.get("/lines");
            const payload = Array.isArray(res.data)
                ? res.data
                : (res.data?.lines ?? res.data?.data ?? res.data?.stations ?? []);
            setLines(Array.isArray(payload) ? payload : []);
        } catch (err) {
            console.error("loadLines error", err);
            setLines([]);
        } finally {
            setLoadingLines(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "active") {
            setForm((p) => ({ ...p, [name]: Number(value) }));
        } else if (name === "line_id") {
            setForm((p) => ({ ...p, [name]: value }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
        setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const errs = {};
        if (!form.vehicle_code) errs.vehicle_code = ["Unesite registraciju / kod vozila."];
        if (!form.line_id) errs.line_id = ["Izaberite liniju."];
        if (typeof form.active === "undefined" || ![0, 1].includes(Number(form.active))) errs.active = ["Active mora biti 0 ili 1."];

        if (Object.keys(errs).length) {
            setFieldErrors(errs);
            setError("Popunite obavezna polja.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                vehicle_code: form.vehicle_code,
                line_id: form.line_id,
                active: Number(form.active),
            };

            const res = await axiosClient.post("/vehicles", payload);

            console.log("vehicle create response:", res.data);

            onAddSuccess?.();
            onClose();
        } catch (err) {
            console.error("create vehicle error", err);

            if (!err.response) {
                setError("Network error: proverite konekciju / CORS.");
                setLoading(false);
                return;
            }

            // pokušaj parsiranje grešaka iz Laravel-a
            const resp = typeof err.response.data === "string"
                ? (() => { try { return JSON.parse(err.response.data); } catch { return { message: err.response.data }; } })()
                : err.response.data;

            if (resp && resp.errors) {
                setFieldErrors(resp.errors);
                setError("Proverite polja (validation errors).");
            } else if (resp && resp.message) {
                setError(resp.message);
            } else {
                setError(err.response?.statusText || "Greška pri kreiranju vozila");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Dodaj vozilo</h2>

            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 8, borderRadius: 6, marginBottom: 8 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <label style={{ display: "block", marginBottom: 6 }}>Registracija / kod</label>
                    <input name="vehicle_code" value={form.vehicle_code} onChange={handleChange} />
                    {fieldErrors.vehicle_code && <div style={{ color: "red" }}>{fieldErrors.vehicle_code.join(", ")}</div>}
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: 6 }}>Linija</label>
                    {loadingLines ? (
                        <div>Učitavanje linija...</div>
                    ) : (
                        <select name="line_id" value={form.line_id} onChange={handleChange}>
                            <option value="">-- Izaberi liniju --</option>
                            {lines.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.code} — {l.name ?? l.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {fieldErrors.line_id && <div style={{ color: "red" }}>{fieldErrors.line_id.join(", ")}</div>}
                </div>



                <div>
                    <label style={{ display: "block", marginBottom: 6 }}>Status</label>
                    <select name="active" value={form.active} onChange={handleChange}>
                        <option value={1}>Aktivno</option>
                        <option value={0}>Neaktivno</option>
                    </select>
                    {fieldErrors.active && <div style={{ color: "red" }}>{fieldErrors.active.join(", ")}</div>}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button type="button" onClick={onClose}>Otkaži</button>
                    <button type="submit" disabled={loading} style={{ background: "#A855F7", color: "white" }}>{loading ? "Sačuvaj..." : "Sačuvaj"}</button>
                </div>
            </form>
        </div>
    );
}