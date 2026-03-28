// src/components/VehiclesList.jsx
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Bus } from 'lucide-react';
import axiosClient from "../../axios-client.js";

export default function VehiclesList() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingVehicle, setEditingVehicle] = useState(null);
    const [lines, setLines] = useState([]);
    const [linesLoading, setLinesLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState(null);

    async function load() {
        try {
            setLoading(true);
            const res = await axiosClient.get('/vehicles');
            const payload = res.data?.vehicles ?? res.data?.data ?? res.data ?? [];
            setVehicles(Array.isArray(payload) ? payload : []);
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
            await axiosClient.delete(`/vehicles/${id}`);
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error(err);
            alert('Neuspeh pri brisanju');
        }
    }

    const openEdit = async (vehicle) => {
        setModalError(null);
        setEditingVehicle(null);
        try {
            setLinesLoading(true);
            const linesRes = await axiosClient.get('/lines');
            const linesPayload = linesRes.data?.lines ?? linesRes.data?.data ?? linesRes.data ?? [];
            setLines(Array.isArray(linesPayload) ? linesPayload : []);
        } catch (err) {
            console.error('load lines error', err);
            setLines([]);
        } finally {
            setLinesLoading(false);
        }

        // Prefill editing object: use vehicle_code and active
        setEditingVehicle({
            id: vehicle.id,
            vehicle_code: vehicle.vehicle_code ?? vehicle.code ?? vehicle.registration ?? '',
            line_id: vehicle.line?.id ?? vehicle.line_id ?? '',
            // ensure active is 0 or 1 (fallback to 1)
            active: (vehicle.active === 0 || vehicle.active === 1) ? vehicle.active : (vehicle.active ? 1 : 0),
        });
    };

    const closeModal = () => {
        setEditingVehicle(null);
        setModalError(null);
        setSaving(false);
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        // for select that sets numeric values, convert to Number for active/line_id if needed
        setEditingVehicle(prev => ({ ...prev, [name]: name === 'active' ? Number(value) : value }));
        setModalError(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingVehicle) return;
        setModalError(null);

        if (!editingVehicle.vehicle_code) {
            setModalError('Unesite kod/registraciju vozila.');
            return;
        }
        if (!editingVehicle.line_id) {
            setModalError('Izaberite liniju.');
            return;
        }

        const activeVal = Number(editingVehicle.active);
        if (![0,1].includes(activeVal)) {
            setModalError('Active mora biti 0 ili 1.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                vehicle_code: editingVehicle.vehicle_code, // send vehicle_code per your validator
                line_id: editingVehicle.line_id,
                active: activeVal,
            };

            const res = await axiosClient.put(`/vehicles/${editingVehicle.id}`, payload);

            // Prefer backend returned updated object if present
            const updated = res.data?.vehicle ?? res.data ?? null;

            setVehicles(prev =>
                prev.map(v => {
                    if (v.id !== editingVehicle.id) return v;
                    if (updated && typeof updated === 'object') return { ...v, ...updated };
                    // fallback patch
                    const newLine = lines.find(l => String(l.id) === String(editingVehicle.line_id)) ?? { id: editingVehicle.line_id };
                    return {
                        ...v,
                        vehicle_code: editingVehicle.vehicle_code,
                        line: newLine,
                        line_id: editingVehicle.line_id,
                        active: activeVal,
                    };
                })
            );

            closeModal();
        } catch (err) {
            console.error('save vehicle error', err);
            const resp = err.response?.data;
            if (resp) {
                const parsed = typeof resp === 'string' ? (() => { try { return JSON.parse(resp); } catch { return { message: resp }; } })() : resp;
                setModalError(parsed?.message || (parsed?.errors ? Object.values(parsed.errors).flat().join(', ') : 'Greška pri snimanju vozila'));
            } else {
                setModalError('Network error');
            }
        } finally {
            setSaving(false);
        }
    };

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
                                <h3 style={{ margin: 0 }}>{vehicle.vehicle_code ?? vehicle.code ?? vehicle.registration ?? '—'}</h3>
                                <div style={{ color: '#6B7280' }}>
                                    Linija {vehicle.line?.code ?? vehicle.line_code ?? vehicle.line_id ?? '—'} · {' '}
                                    <span>{vehicle.active === 1 ? '🟢 Aktivno' : '🔴 Neaktivno'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                style={{ padding: 8 }}
                                title="Izmeni"
                                onClick={() => openEdit(vehicle)}
                            >
                                <Edit style={{ width: 20, height: 20 }} />
                            </button>
                            {/*<button style={{ padding: 8 }} title="Izmeni"><Edit style={{ width: 20, height: 20 }} /></button>*/}
                            <button style={{ padding: 8 }} title="Obriši" onClick={() => handleDelete(vehicle.id)}><Trash2 style={{ width: 20, height: 20 }} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {editingVehicle && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 80
                }} onClick={closeModal}>
                    <div onClick={(e) => e.stopPropagation()} style={{ width: 520, maxWidth: '100%', background: 'white', borderRadius: 12, padding: 20 }}>
                        <h3 style={{ marginTop: 0 }}>Izmeni vozilo</h3>
                        {modalError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 8, borderRadius: 6, marginBottom: 8 }}>{modalError}</div>}

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6 }}>Registracija / kod</label>
                                <input name="vehicle_code" value={editingVehicle.vehicle_code} onChange={handleModalChange} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 6 }}>Linija</label>
                                {linesLoading ? <div>Učitavanje linija...</div> : (
                                    <select name="line_id" value={editingVehicle.line_id} onChange={handleModalChange}>
                                        <option value="">-- Izaberi liniju --</option>
                                        {lines.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
                                <select
                                    name="active"
                                    value={editingVehicle.active}
                                    onChange={handleModalChange}
                                >
                                    <option value={1}>Aktivno</option>
                                    <option value={0}>Neaktivno</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                                <button type="button" onClick={closeModal}>Otkaži</button>
                                <button type="submit" disabled={saving} style={{ background: '#A855F7', color: 'white' }}>{saving ? 'Snimam...' : 'Sačuvaj'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}