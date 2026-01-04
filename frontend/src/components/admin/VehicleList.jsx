// src/components/VehiclesList.jsx
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Bus } from 'lucide-react';
import axiosClient from "../../axios-client.js";

export default function VehiclesList({ api }) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function load() {
        try {
            setLoading(true);
            const res = await axiosClient.get('/vehicles');
            setVehicles(res.data.vehicles || []);
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Greška pri učitavanju vozila');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!window.confirm('Obriši vozilo?')) return;
        try {
            await axiosClient.delete(`/vehicles/${vehicles.id}`, {})
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error(err);
            alert('Neuspeh pri brisanju');
        }
    }

    if (loading) return <div style={{ padding: 24 }}>Učitavanje vozila...</div>;
    if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vehicles.map(vehicle => (
                    <div key={vehicle.id} style={{ padding: 16, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ background: 'linear-gradient(to bottom right, #F97316, #DC2626)', padding: 12, borderRadius: 8 }}>
                                <Bus style={{ width: 24, height: 24, color: 'white' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{vehicle.vehicle_code}</h3>
                                <p style={{ margin: 0, color: '#6B7280' }}>
                                    Linija {vehicle.line.code} -
                                    <span style={{
                                        color: vehicle.active === 1 ? '#16A34A' : '#6B7280'
                                    }}>
                    {vehicle.active === 1 ? 'Aktivno'  : 'Neaktivno'}
                  </span>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ padding: 8 }} title="Izmeni"><Edit style={{ width: 20, height: 20 }} /></button>
                            <button style={{ padding: 8 }} title="Obriši" onClick={() => handleDelete(vehicle.id)}><Trash2 style={{ width: 20, height: 20 }} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}