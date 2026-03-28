// src/components/LinesTab.jsx (Ažurirano za dohvat podataka)
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';
import { fetchAllLines } from '../../api/user.js';

export default function LinesTab({stationId}) {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadLines = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchAllLines(stationId);
                console.log('fetchAllLines response:', res);


                const arr = Array.isArray(res)
                    ? res
                    : (Array.isArray(res?.lines) ? res.lines : (Array.isArray(res?.data) ? res.data : []));

                if (mounted) setLines(arr);
            } catch (err) {
                console.error("Greška pri dohvatu linija:", err);
                if (mounted) {
                    setError("Neuspešno učitavanje linija.");
                    setLines([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadLines();

        return () => {
            mounted = false;
        };
    }, [stationId]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
            <h2
                style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111827',
                    lineHeight: '1.2',
                }}
            >
                Sve Linije
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading && <div>Učitavanje...</div>}

                {error && <div style={{ color: '#EF4444', fontWeight: '600' }}>Greška: {error}</div>}

                {!loading && !error && lines.length === 0 && <div>Nema linija</div>}

                {Array.isArray(lines) && lines.map((line) => (
                    <motion.div
                        key={line.id}
                        whileHover={{ scale: 1.02 }}
                        style={{
                            padding: '16px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#BFDBFE';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div
                                style={{
                                    background: 'linear-gradient(to bottom right, #3B82F6, #4F46E5)',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    lineHeight: '1.2',
                                }}
                            >
                                {line.code}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#111827',
                                        marginBottom: '4px',
                                        lineHeight: '1.2',
                                    }}
                                >
                                    {line.name}
                                </h3>
                                <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.5' }}>
                                    {line.mode === 'bus' ? '🚌 Autobus' : '🚊 Tramvaj'}
                                </p>
                            </div>

                            <Bus style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
