import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import {Clock1, Trash2} from "lucide-react";

export default function LinesAndTrips() {
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loadingLines, setLoadingLines] = useState(false);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadLines() {
            try {
                setLoadingLines(true);
                const res = await axiosClient.get('/lines');
                console.log("Sve linije:", res.data.lines);
                setLines(res.data.lines || []);
            } catch (err) {
                console.error(err);
                setError(err?.message || 'Greška pri učitavanju linija');
            } finally {
                setLoadingLines(false);
            }
        }

        loadLines();
    }, []);

    useEffect(() => {
        if (!selectedLine) return;

        async function loadTrips() {
            try {
                setLoadingTrips(true);
                const res = await axiosClient.get(`/trip/line/${selectedLine.id}`);
                console.log(`Polasci za liniju ${selectedLine.name}:`, res.data.trips);
                setTrips(res.data.trips || []);
            } catch (err) {
                console.error(err);
                setError(err?.message || 'Greška pri učitavanju polazaka');
            } finally {
                setLoadingTrips(false);
            }
        }

        loadTrips();
    }, [selectedLine]);

    return (
        <div style={{ padding: 24 }}>
            <h2>Linije</h2>
            {loadingLines && <p>Učitavanje linija...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {lines.map(line => (
                    <div key={line.id} style={{
                        padding: 16,
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{
                                background: line.color || 'linear-gradient(to bottom right, #3B82F6, #4F46E5)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: 8,
                                fontWeight: 700
                            }}>
                                {line.code}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{line.name}</h3>
                                <p style={{ margin: 0, color: '#6B7280' }}>
                                    {line.mode === 'bus' ? '🚌 Autobus' : '🚊 Tramvaj'} • {line.active || line.is_active ? (String(line.active) === '1' || line.active === true ? 'Aktivna' : 'Neaktivna') : (line.status || '—')}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>

                            <button style={{ padding: 8 }} title="Obriši" onClick={() => setSelectedLine(line)}>
                                <Clock1 style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </ul>

            {selectedLine && (
                <div style={{ marginTop: 24 }}>
                    <h3>Polasci za liniju: {selectedLine.name}</h3>
                    {loadingTrips && <p>Učitavanje polazaka...</p>}
                    {trips.length === 0 && !loadingTrips && <p>Nema polazaka za ovu liniju.</p>}
                    <ul>
                        {trips.map(trip => (
                            <li key={trip.id}>
                                {trip.scheduled_start_time}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}