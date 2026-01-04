import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { fetchArrivalsForStation } from "../api/user.js";

const arrivalStatusMap = {
    active: { color: "#10B981", label: "U kretanju" },
    scheduled: { color: "#F59E0B", label: "Planirano" },
    late: { color: "#EF4444", label: "Kasni" },
};

export default function ArrivalsPanel({ station }) {
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadArrivals = useCallback(async () => {
        if (!station || station.id === 0) {
            setArrivals([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchArrivalsForStation(station.id);
            // Backend vraća objekat { tripStops: [...], message: "..." }
            setArrivals(Array.isArray(data.tripStops) ? data.tripStops : []);
        } catch (err) {
            console.error("Greška pri dohvatu dolazaka:", err);
            setError("Neuspešno učitavanje dolazaka.");
            setArrivals([]);
        } finally {
            setLoading(false);
        }
    }, [station]);

    useEffect(() => {
        loadArrivals();
    }, [loadArrivals]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                padding: "24px",
                position: "sticky",
                top: "24px",
            }}
        >


            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loading && <div style={{ color: "#3B82F6" }}>Učitavanje dolazaka...</div>}
                {error && <div style={{ color: "#EF4444", fontWeight: 600 }}>{error}</div>}
                {!loading && arrivals.length === 0 && !error && station?.id !== 0 && (
                    <div style={{ color: "#6B7280" }}>Nema predviđenih dolazaka.</div>
                )}
                {!loading &&
                    arrivals.map((arrival) => {
                        const line = arrival.station?.lines?.[0] || { code: "??", name: "Nepoznato" };
                        const statusInfo = arrivalStatusMap["scheduled"]; // po default-u sve scheduled
                        return (
                            <motion.div
                                key={arrival.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                style={{
                                    padding: "12px",
                                    background: "linear-gradient(to right, #F9FAFB, #EFF6FF)",
                                    borderRadius: "8px",
                                    border: "1px solid #DBEAFE",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div
                                            style={{
                                                background: "linear-gradient(to bottom right, #3B82F6, #4F46E5)",
                                                color: "white",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {line.code}
                                        </div>
                                        <span style={{ fontSize: "16px", fontWeight: 600, color: "#111827", lineHeight: 1.5 }}>
                      {line.name}
                    </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "16px", color: "#2563EB", fontWeight: 500, lineHeight: 1.5 }}>
                    {arrival.scheduled_arrival}
                  </span>
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: statusInfo.color,
                                            title: statusInfo.label,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
            </div>
        </motion.div>
    );
}