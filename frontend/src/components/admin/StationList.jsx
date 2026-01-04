// src/components/StationsList.jsx
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, MapPin } from 'lucide-react';
import axiosClient from "../../axios-client.js";

export default function StationsList({ api }) {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function load() {
        try {
            setLoading(true);
            const res = await axiosClient.get('/stations');
            console.log(res.data.data);
            setStations(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Greška pri učitavanju stanica');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!window.confirm('Obriši stanicu?')) return;
        try {
            await api.deleteStation(id);
            setStations(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
            alert('Neuspeh pri brisanju');
        }
    }

    if (loading) return <div style={{ padding: 24 }}>Učitavanje stanica...</div>;
    if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stations.map(station => (
                    <div key={station.id} style={{
                        padding: 16, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ background: 'linear-gradient(to bottom right, #10B981, #059669)', padding: 12, borderRadius: 8 }}>
                                <MapPin style={{ width: 24, height: 24, color: 'white' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{station.name}</h3>
                                <p style={{ margin: 0, color: '#6B7280' }}>{station.address}</p>
                                <p style={{ margin: 0, color: '#9CA3AF' }}>Kod: {station.code} • {station.lat}, {station.lng}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ padding: 8 }} title="Izmeni"><Edit style={{ width: 20, height: 20 }} /></button>
                            <button style={{ padding: 8 }} title="Obriši" onClick={() => handleDelete(station.id)}><Trash2 style={{ width: 20, height: 20 }} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}