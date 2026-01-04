import React from 'react';
import { motion } from 'framer-motion';
import { Route as RouteIcon, MapPin, Bus, Clock } from 'lucide-react';

export default function StatCards({ stats }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16,
            marginBottom: 24
        }}>
            {stats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    style={{
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        padding: 24
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 4 }}>{stat.label}</p>
                            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#111827' }}>{stat.value}</h2>
                        </div>
                        <div style={{ background: stat.color, padding: 12, borderRadius: 8 }}>
                            {/* stat.icon is a component (lucide-react) */}
                            <stat.icon style={{ width: 24, height: 24, color: 'white' }} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}