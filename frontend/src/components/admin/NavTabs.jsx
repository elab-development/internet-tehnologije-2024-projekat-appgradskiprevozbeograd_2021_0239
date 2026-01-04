// src/components/NavTabs.jsx
import React from 'react';
import { MapPin, Bus, Clock, Route as RouteIcon } from 'lucide-react';

export default function NavTabs({ active, setActive }) {
    const tabs = [
        { key: 'lines', icon: RouteIcon, label: 'Linije', gradient: 'linear-gradient(to right, #3B82F6, #4F46E5)' },
        { key: 'stations', icon: MapPin, label: 'Stanice', gradient: 'linear-gradient(to right, #10B981, #059669)' },
        { key: 'trips', icon: Clock, label: 'Putovanja', gradient: 'linear-gradient(to right, #A855F7, #EC4899)' },
        { key: 'vehicles', icon: Bus, label: 'Vozila', gradient: 'linear-gradient(to right, #F97316, #DC2626)' },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 8,
            marginBottom: 24,
            background: 'white',
            padding: 8,
            borderRadius: 12,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            {tabs.map(t => (
                <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px 16px',
                        background: active === t.key ? t.gradient : 'transparent',
                        color: active === t.key ? 'white' : '#6B7280',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 16,
                        fontWeight: 500
                    }}
                >
                    <t.icon style={{ width: 20, height: 20 }} />
                    {t.label}
                </button>
            ))}
        </div>
    );
}