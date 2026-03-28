import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";

/**
 * TripForm:
 * - biraš liniju (dropdown)
 * - biraš dan(e) u nedelji (checkboxes)
 * - za svaki odabran dana dodaješ listu polazaka (npr. 07:00, 12:30)
 * - na submit šalješ jedan request per trip or batch depending on backend
 */
export default function TripForm({ onClose, onAddSuccess }) {
    const [lines, setLines] = useState([]);
    const [loadingLines, setLoadingLines] = useState(false);
    // const [form, setForm] = useState({ line_id: "", days: {}, departures: {} });
    const [form, setForm] = useState({
        line_id: "",
        days: {},
        departures: {} // { monday: [], tuesday: [], ... }
    });

    // days: { monday: true, tuesday: false ... } departures: { monday: ['07:00','12:00'], ... }
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [currentTimes, setCurrentTimes] = useState({}); // { monday: "", tuesday: "", ... }


    const week = [
        { key: "monday", label: "Ponedeljak" },
        { key: "tuesday", label: "Utorak" },
        { key: "wednesday", label: "Sreda" },
        { key: "thursday", label: "Četvrtak" },
        { key: "friday", label: "Petak" },
        { key: "saturday", label: "Subota" },
        { key: "sunday", label: "Nedelja" },
    ];

    useEffect(() => { loadLines(); }, []);


    function getNextDateForDay(dayKey) {
        const dayMap = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0, // Sunday = 0 u JS
        };
        const today = new Date();
        const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday...
        let targetDay = dayMap[dayKey];
        let diff = targetDay - todayDay;
        if (diff < 0) diff += 7; // sledeći taj dan u nedelji
        const result = new Date(today);
        result.setDate(today.getDate() + diff);
        return result.toISOString().split("T")[0]; // vraća yyyy-mm-dd
    }


    async function loadLines() {
        try {
            setLoadingLines(true);
            const res = await axiosClient.get("/lines");
            const payload = Array.isArray(res.data) ? res.data : (res.data?.lines || res.data?.data || []);
            setLines(payload || []);
        } catch (err) {
            console.error("loadLines", err);
            setLines([]);
        } finally { setLoadingLines(false); }
    }

    // function toggleDay(key) {
    //     setForm(prev => ({ ...prev, days: { ...prev.days, [key]: !prev.days[key] } }));
    //     // ensure departures array exists
    //     setForm(prev => ({ ...prev, departures: { ...prev.departures, [key]: prev.departures?.[key] || [] } }));
    // }
    function toggleDay(key) {
        setForm(prev => {
            const newDays = { ...prev.days, [key]: !prev.days[key] };
            const newDepartures = { ...prev.departures, [key]: prev.departures[key] || [] };
            return { ...prev, days: newDays, departures: newDepartures };
        });
    }


    function addDeparture(dayKey, time) {
        if (!time) return;
        setForm(prev => ({ ...prev, departures: { ...prev.departures, [dayKey]: [...(prev.departures[dayKey] || []), time] } }));
    }

    function removeDeparture(dayKey, idx) {
        setForm(prev => ({ ...prev, departures: { ...prev.departures, [dayKey]: prev.departures[dayKey].filter((_, i) => i !== idx) } }));
    }

    // const handleSave = async () => {
    //     setError(null);
    //     if (!form.line_id) { setError("Izaberite liniju."); return; }
    //     // collect days with times
    //     const selectedDays = Object.keys(form.days).filter(k => form.days[k]);
    //     if (!selectedDays.length) { setError("Izaberite bar jedan dan u nedelji."); return; }
    //
    //     setSaving(true);
    //     try {
    //         // backend design: if you have endpoint to create trips per line and day, call it accordingly
    //         // We'll iterate selected days and create trips for each departure time.
    //         for (const day of selectedDays) {
    //             const times = form.departures[day] || [];
    //             for (const t of times) {
    //                 // backend expects payload shape — adapt as needed
    //                 await axiosClient.post("/trip/add", {
    //                     line_id: form.line_id,
    //                     day_of_week: day,    // backend should accept this or map it
    //                     departure_time: t
    //                 });
    //             }
    //         }
    //
    //         onAddSuccess?.();
    //         onClose();
    //     } catch (err) {
    //         console.error("save trips", err);
    //         setError(err.response?.data?.message || err.message || "Greška pri snimanju putovanja");
    //     } finally { setSaving(false); }
    // };

    const handleSave = async () => {
        setError(null);
        if (!form.line_id) { setError("Izaberite liniju."); return; }

        const selectedDays = Object.keys(form.days).filter(k => form.days[k]);
        if (!selectedDays.length) { setError("Izaberite bar jedan dan u nedelji."); return; }

        setSaving(true);
        try {
            for (const day of selectedDays) {
                const date = getNextDateForDay(day); // fiksni datum za taj dan
                const times = form.departures[day] || [];
                for (const t of times) {
                    await axiosClient.post("/trip/add", {
                        line_id: form.line_id,
                        service_date: date,
                        scheduled_start_time: t
                    });
                }
            }

            onAddSuccess?.();
            onClose();
        } catch (err) {
            console.error("save trips", err);
            setError(err.response?.data?.message || err.message || "Greška pri snimanju putovanja");
        } finally {
            setSaving(false);
        }
    };


    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Dodaj putovanja</h2>
            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 8, borderRadius: 6, marginBottom: 8 }}>{error}</div>}

            <label>Linija</label>
            <select value={form.line_id} onChange={(e) => setForm(prev => ({ ...prev, line_id: e.target.value }))}>
                <option value="">-- Izaberi liniju --</option>
                {lines.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
            </select>

            <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Dani u nedelji</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    {week.map(w => (
                        <label key={w.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input type="checkbox" checked={!!form.days[w.key]} onChange={() => toggleDay(w.key)} />
                            {w.label}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                {week.filter(w => form.days[w.key]).map(w => (
                    <div key={w.key} style={{ marginBottom: 12, border: "1px dashed #E5E7EB", padding: 8, borderRadius: 8 }}>
                        <div style={{ fontWeight: 600 }}>{w.label}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                            {/*<input type="time" id={`time-${w.key}`} />*/}
                            <input
                                type="time"
                                value={currentTimes[w.key] || ""}
                                onChange={(e) => setCurrentTimes(prev => ({ ...prev, [w.key]: e.target.value }))}
                            />
                            {/*<button type="button" onClick={() => {*/}
                            {/*    const input = document.getElementById(`time-${w.key}`);*/}
                            {/*    addDeparture(w.key, input?.value);*/}
                            {/*    if (input) input.value = "";*/}
                            {/*}}>Dodaj polazak</button>*/}
                            <button type="button" onClick={() => {
                                const time = currentTimes[w.key];
                                if (!time) return;
                                addDeparture(w.key, time);
                                setCurrentTimes(prev => ({ ...prev, [w.key]: "" })); // očisti input
                            }}>Dodaj polazak</button>
                        </div>

                        <div style={{ marginTop: 8 }}>
                            {(form.departures[w.key] || []).map((t, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6 }}>
                                    <div>{t}</div>
                                    <button onClick={() => removeDeparture(w.key, idx)}>Obriši</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={onClose}>Otkaži</button>
                <button onClick={handleSave} disabled={saving} style={{ background: "#A855F7", color: "white" }}>{saving ? "Snimam..." : "Sačuvaj"}</button>
            </div>
        </div>
    );
}