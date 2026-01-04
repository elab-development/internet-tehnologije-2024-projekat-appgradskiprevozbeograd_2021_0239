import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import StopRowEditor from "./StopRowEditor.jsx";

export default function StopsEditor({ line, onCancel, onSaved }) {
    const [allStations, setAllStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { loadStations(); }, []);

    async function loadStations() {
        try {
            setLoadingStations(true);
            const res = await axiosClient.get("/stations");
            // try common payload structures
            const payload = Array.isArray(res.data) ? res.data : (res.data?.stations || res.data?.data || []);
            setAllStations(payload || []);
        } catch (err) {
            console.error("loadStations error", err);
            setAllStations([]);
        } finally { setLoadingStations(false); }
    }

    const addStopToList = (stop) => {
        setError(null);
        // basic validation
        if (!stop.station_id) { setError("Izaberite stanicu."); return; }
        if (!stop.stop_sequence || Number(stop.stop_sequence) < 1) { setError("stop_sequence >= 1"); return; }
        if (!stop.direction) { setError("Unesite pravac"); return; }
        setStops(prev => [...prev, stop]);
    };

    const removeStop = (idx) => setStops(prev => prev.filter((_, i) => i !== idx));
    const updateStop = (idx, nv) => setStops(prev => prev.map((s,i)=> i===idx?({...s,...nv}):s));

    const saveStops = async () => {
        if (!stops.length) { setError("Nema stajališta za snimanje."); return; }
        setLoading(true); setError(null);
        try {
            const failures = [];
            // try batch first: many backends prefer one call with array — if your backend supports, change to single request
            // Here we do sequential POST to /lines/{lineId}/stations
            for (const s of stops) {
                try {
                    await axiosClient.post(`/lines/${line.id}/stations`, {
                        station_id: s.station_id,
                        stop_sequence: Number(s.stop_sequence),
                        direction: s.direction,
                        distance_from_start: s.distance_from_start ? Number(s.distance_from_start) : null
                    });
                } catch (err) {
                    failures.push({ stop: s, error: err.response?.data || err.message || err });
                }
            }
            if (failures.length) {
                setError("Neke stanice nisu snimljene. Proveri konzolu.");
                console.warn("stops save failures", failures);
                setLoading(false);
                return;
            }
            onSaved?.();
        } catch (err) {
            console.error(err);
            setError(err.message || "Greška pri snimanju");
        } finally { setLoading(false); }
    };

    return (
        <div>
            <p>Linija kreirana: <strong>{line.name} ({line.code})</strong> (id: {line.id})</p>
            <h4>Dodaj stajališta za A/B pravac</h4>
            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 8, borderRadius: 6, marginBottom: 8 }}>{error}</div>}

            <div style={{ marginBottom: 8 }}>
                {loadingStations ? <div>Učitavanje stanica...</div> : <StopRowEditor onAdd={addStopToList} stations={allStations} />}
            </div>

            <div>
                <h5>Lista dodanih stajališta</h5>
                {stops.length === 0 ? <div>Nema dodatih stajališta.</div> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {stops.map((s, idx) => {
                            const stObj = allStations.find(st => String(st.id) === String(s.station_id));
                            return (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: 8, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{stObj ? stObj.name : `ID ${s.station_id}`}</div>
                                        <div style={{ color: "#6B7280", fontSize: 13 }}>seq: {s.stop_sequence} · dir: {s.direction} · dist: {s.distance_from_start ?? '—'}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => {
                                            const newSeq = prompt("Novi redosled (stop_sequence)", s.stop_sequence);
                                            const newDir = prompt("Novi pravac (A/B)", s.direction);
                                            const newDist = prompt("Nova udaljenost (m)", s.distance_from_start ?? "");
                                            if (newSeq) updateStop(idx, { stop_sequence: newSeq, direction: newDir || s.direction, distance_from_start: newDist });
                                        }}>Izmeni</button>
                                        <button onClick={() => removeStop(idx)}>Obriši</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={onCancel}>Nazad (izmeni liniju)</button>
                <button onClick={saveStops} disabled={loading} style={{ background: "#A855F7", color: "white" }}>{loading ? "Snimam..." : "Sačuvaj stajališta"}</button>
            </div>
        </div>
    );
}