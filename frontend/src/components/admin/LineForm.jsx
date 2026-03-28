import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import StopsEditor from "./StopsEditor.jsx";

export default function LineForm({ onClose, onAddSuccess }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ code: "", name: "", mode: "bus", color: "" });
    const [createdLine, setCreatedLine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formData.code || !formData.name) { setError("Unesite kod i naziv linije."); return; }
        setLoading(true);
        try {
            const res = await axiosClient.post("/line/add", {
                code: formData.code,
                name: formData.name,
                mode: formData.mode,
                active: 1,
                color: formData.color || null
            });
            // backend may return created object in various shapes
            const created = res.data?.line || res.data || (res.data?.data ? res.data.data : null);
            if (!created || !created.id) {
                // try find id
                const id = res.data?.id || res.data?.data?.id;
                if (id) created.id = id;
            }
            if (!created) throw new Error("Neuspešno kreiranje linije.");
            setCreatedLine(created);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Greška pri kreiranju linije.");
            console.error(err);
        } finally { setLoading(false); }
    };

    const handleStopsSaved = () => {
        onAddSuccess?.();
        onClose();
    };

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>{step === 1 ? "Dodaj Liniju" : "Dodaj stajališta"}</h2>
            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 8, borderRadius: 6, marginBottom: 8 }}>{String(error)}</div>}

            {step === 1 && (
                <form onSubmit={handleCreate}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label>Kod linije</label>
                            <input name="code" value={formData.code} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Tip</label>
                            <select name="mode" value={formData.mode} onChange={handleChange}>
                                <option value="bus">Autobus</option>
                                <option value="tram">Tramvaj</option>
                                <option value="trolley">Trolejbus</option>
                            </select>
                        </div>
                        <div>
                            <label>Naziv linije</label>
                            <input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Boja (hex)</label>
                            <input name="color" value={formData.color} onChange={handleChange} placeholder="#123abc" />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                        <button type="button" onClick={onClose}>Otkaži</button>
                        <button type="submit" disabled={loading} style={{ background: "#A855F7", color: "white" }}>{loading ? "Kreiram..." : "Kreiraj liniju"}</button>
                    </div>
                </form>
            )}

            {step === 2 && createdLine && (
                <StopsEditor
                    line={createdLine}
                    onCancel={() => { setStep(1); setCreatedLine(null); }}
                    onSaved={handleStopsSaved}
                />
            )}
        </div>
    );
}