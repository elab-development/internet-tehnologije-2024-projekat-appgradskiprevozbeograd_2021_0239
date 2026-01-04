import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axiosClient from '../../axios-client.js'; // prilagodi putanju ako treba

function getLineInfo(line) {
    let icon = '❓';
    if (line.mode === 'bus') icon = '🚌';
    else if (line.mode === 'tram') icon = '🚊';
    else if (line.mode === 'trolley') icon = '⚡';



    return `${icon} ${line.mode.charAt(0).toUpperCase() + line.mode.slice(1)} • ${status}`;
}

export default function LineList() {
    const [lines, setLines] = useState(null); // null = loading, [] = loaded empty
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    function extractArrayFromResponse(resp) {
        if (!resp) return null;
        const payload = resp.data !== undefined ? resp.data : resp;
        if (!payload) return null;

        if (Array.isArray(payload)) return payload;

        const keys = ['lines', 'data', 'items', 'payload'];
        for (const key of keys) {
            if (payload[key] && Array.isArray(payload[key])) return payload[key];
        }
        for (const k of Object.keys(payload)) {
            if (Array.isArray(payload[k])) return payload[k];
        }

        return null;
    }

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosClient.get('/lines');
                // debug: console.log('lines raw response', res);
                const arr = extractArrayFromResponse(res);
                if (!mounted) return;
                if (arr) {
                    setLines(arr);
                } else {
                    setLines([]); // treat as empty
                    console.warn('LineList: expected array but could not find it in response', res);
                }
            } catch (err) {
                console.error('LineList load error', err);
                if (!mounted) return;
                setError(err);
                setLines([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => { mounted = false; };
    }, []);

    async function handleDelete(id) {
        if (!window.confirm('Obriši liniju?')) return;
        try {
            await axiosClient.delete(`/line/delete/${id}`);
            setLines(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error('delete error', err);
            alert('Neuspeh pri brisanju');
        }
    }

    if (loading) return <div style={{ padding: 24 }}>Učitavanje linija...</div>;
    if (error) return <div style={{ padding: 24, color: 'red' }}>Greška pri učitavanju linija.</div>;

    if (!Array.isArray(lines) || lines.length === 0) {
        return <div style={{ padding: 24 }}>Nema linija za prikaz.</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lines.map((line) => (
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
                                    {line.mode === 'bus'
                                        ? '🚌 Autobus'
                                        : line.mode === 'tram'
                                            ? '🚊 Tramvaj'
                                            : line.mode === 'trolley'
                                                ? '⚡ Trolejbus'
                                                : '❓ Nepoznat'}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>

                            <button style={{ padding: 8 }} title="Obriši" onClick={() => handleDelete(line.id)}>
                                <Trash2 style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}