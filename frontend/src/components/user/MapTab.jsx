// src/components/MapTab.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import axiosClient from "../../axios-client.js";

function createLineIcon(lineLabel) {
    return L.divIcon({
        className: "custom-vehicle-icon",
        html: `<div style="
            display:flex;
            align-items:center;
            justify-content:center;
            width:36px;
            height:36px;
            border-radius:18px;
            background:#2563EB;
            color:white;
            font-weight:700;
            box-shadow:0 6px 12px rgba(0,0,0,0.12);
            border: 2px solid rgba(255,255,255,0.6);
            font-size:14px;
          ">${lineLabel}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
}

/** Fit bounds helper */
function FitBoundsToMarkers({ markers }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !markers || markers.length === 0) return;
        const latLngs = markers
            .map(m => (typeof m.lat === "number" && typeof m.lng === "number" ? [m.lat, m.lng] : null))
            .filter(Boolean);
        if (latLngs.length === 0) return;
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds.pad(0.2), { maxZoom: 16, animate: true });
    }, [map, markers]);
    return null;
}


export default function MapTab({ stationId, pollIntervalMs = 5000 }) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const cancelTokensRef = useRef([]);

    const toNumber = (v) => {
        if (v === undefined || v === null) return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
    };

    const fetchVehiclesForStation = useCallback(async () => {
        if (!stationId) return;

        setLoading(true);
        setError(null);

        cancelTokensRef.current.forEach(ct => ct.cancel?.("cancelling previous"));
        cancelTokensRef.current = [];

        const stationLinesCancel = axiosClient.CancelToken?.source ? axiosClient.CancelToken.source() : null;
        if (stationLinesCancel) cancelTokensRef.current.push(stationLinesCancel);

        try {
            const linesRes = await axiosClient.get(`/stations/${stationId}/lines`, {
                cancelToken: stationLinesCancel ? stationLinesCancel.token : undefined,
            });

            const payload = linesRes?.data ?? linesRes;
            const linesList = Array.isArray(payload)
                ? payload
                : (Array.isArray(payload.data) ? payload.data : (Array.isArray(payload.lines) ? payload.lines : []));

            if (linesList.length === 0) {
                setVehicles([]);
                return;
            }

            const vehiclePromises = linesList.map(line => {
                const lineId = line.id ?? line.line_id ?? line.line ?? null;
                if (!lineId) return Promise.resolve([]);

                const ct = axiosClient.CancelToken?.source ? axiosClient.CancelToken.source() : null;
                if (ct) cancelTokensRef.current.push(ct);

                return axiosClient.get(`/vehicles/line/${lineId}`, {
                    cancelToken: ct ? ct.token : undefined,
                }).then(res => {
                    const pl = res?.data ?? res;
                    const vehiclesList = Array.isArray(pl.vehicles) ? pl.vehicles : [];

                    return vehiclesList.map(vehicle => {
                        const latestPosition = vehicle.positions && vehicle.positions.length > 0 ? vehicle.positions[0] : null;

                        if (!latestPosition) return null;

                        const lat = toNumber(latestPosition.latitude);
                        const lng = toNumber(latestPosition.longitude);

                        // Provera da li su koordinate validne
                        if (typeof lat !== "number" || typeof lng !== "number") return null;

                        const vehicleId = vehicle.id;
                        // Koristimo Line ID ili Line Code iz Vehicle objekta, ako postoji
                        const lineLabel = vehicle.line?.code ?? vehicle.line ?? line.code ?? line.name ?? (lineId ? String(lineId) : "");

                        return {
                            id: vehicleId,
                            line: lineLabel,
                            lat,
                            lng,
                            speed: toNumber(latestPosition.speed ?? latestPosition.raw_speed),
                            timestamp: latestPosition.timestamp,
                            raw: vehicle,
                        };
                    }).filter(v => v !== null);

                }).catch(err => {
                    console.warn(`Failed to fetch vehicle positions for line ${lineId}:`, err?.message ?? err);
                    return [];
                });
            });

            const results = await Promise.all(vehiclePromises);
            const all = results.flat();

            const dedup = [];
            const seen = new Set();
            for (const v of all) {
                if (!v || !v.id) continue;
                if (seen.has(v.id)) continue;
                seen.add(v.id);
                dedup.push(v);
            }

            setVehicles(dedup);
        } catch (err) {
            if (axiosClient.isCancel && axiosClient.isCancel(err)) {
            } else {
                console.error("Failed to fetch station lines or vehicles:", err);
                setError("Neuspešno učitavanje vozila za stanicu.");
                setVehicles([]);
            }
        } finally {
            setLoading(false);
        }
    }, [stationId]);

    useEffect(() => {
        fetchVehiclesForStation();

        intervalRef.current = setInterval(() => {
            fetchVehiclesForStation();
        }, pollIntervalMs);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            cancelTokensRef.current.forEach(ct => ct.cancel?.("component unmounted"));
            cancelTokensRef.current = [];
        };
    }, [fetchVehiclesForStation, pollIntervalMs]);

    const defaultCenter = vehicles.length > 0 ? [vehicles[0].lat, vehicles[0].lng] : [44.8176, 20.4569];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", padding: 16 }}
        >
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Vozila u Realnom Vremenu</h2>
            <div style={{ marginBottom: 8, color: "#6B7280" }}>Lokacije se osvežavaju svake {pollIntervalMs / 1000} sekundi</div>

            <div style={{ height: 480, borderRadius: 8, overflow: "hidden" }}>
                <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitBoundsToMarkers markers={vehicles} />

                    {vehicles.map((veh) => (
                        <Marker
                            key={veh.id}
                            position={[veh.lat, veh.lng]}
                            icon={createLineIcon(veh.line ?? "")}
                        >
                            <Popup>
                                <div style={{ minWidth: 160 }}>
                                    <div style={{ fontWeight: 700 }}>Linija: {veh.line}</div>
                                    <div style={{ fontWeight: 700 }}>Vozilo: {veh.raw?.vehicle_code}</div>
                                    <div style={{ color: "#6B7280", marginTop: 6 }}>
                                        Lat: {veh.lat.toFixed(6)}, Lng: {veh.lng.toFixed(6)}
                                    </div>
                                    {veh.speed !== undefined && <div>Brzina: {veh.speed} km/h</div>}
                                    {veh.timestamp && <div style={{ fontSize: 12, marginTop: 4 }}>Poslednja pozicija: {new Date(veh.timestamp).toLocaleTimeString()}</div>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {loading && <div style={{ marginTop: 8 }}>Učitavanje pozicija...</div>}
            {error && <div style={{ marginTop: 8, color: "#EF4444" }}>{error}</div>}
        </motion.div>
    );
}