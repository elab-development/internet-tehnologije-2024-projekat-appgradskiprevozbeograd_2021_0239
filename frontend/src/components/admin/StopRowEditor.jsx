import React, { useState } from "react";

export default function StopRowEditor({ onAdd, stations = [] }) {
    const [local, setLocal] = useState({ station_id: "", stop_sequence: "", direction: "A", distance_from_start: "" });

    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <select name="station_id" value={local.station_id} onChange={(e) => setLocal({ ...local, station_id: e.target.value })} style={{ flex: 2 }}>
                <option value="">-- Izaberi stanicu --</option>
                {stations.map(st => <option key={st.id} value={st.id}>{st.name} ({st.code || st.id})</option>)}
            </select>

            <input name="stop_sequence" value={local.stop_sequence} onChange={(e) => setLocal({ ...local, stop_sequence: e.target.value })} placeholder="Redosled" style={{ width: 90 }} />

            <select name="direction" value={local.direction} onChange={(e) => setLocal({ ...local, direction: e.target.value })} style={{ width: 90 }}>
                <option value="A">A</option>
                <option value="B">B</option>
            </select>

            <input name="distance_from_start" value={local.distance_from_start} onChange={(e) => setLocal({ ...local, distance_from_start: e.target.value })} placeholder="Udalj. (m)" style={{ width: 110 }} />

            <button type="button" onClick={() => { onAdd(local); setLocal({ station_id: "", stop_sequence: "", direction: "A", distance_from_start: "" }); }}>Dodaj</button>
        </div>
    );
}