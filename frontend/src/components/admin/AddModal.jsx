import React from "react";
import LineForm from "./LineForm.jsx";
import StationForm from "./StationForm.jsx";
import TripForm from "./TripForm.jsx";
import VehicleForm from "./VehicleForm.jsx";

export default function AddModal({ open, onClose, activeSection, onAddSuccess }) {
    if (!open) return null;

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 60
        }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: 820, maxWidth: "100%", background: "white", borderRadius: 12, padding: 20 }}>
                {activeSection === "lines" && (
                    <LineForm onClose={onClose} onAddSuccess={onAddSuccess} />
                )}

                {activeSection === "stations" && (
                    <StationForm onClose={onClose} onAddSuccess={onAddSuccess} />
                )}

                {activeSection === "trips" && (
                    <TripForm onClose={onClose} onAddSuccess={onAddSuccess} />
                )}

                {activeSection === "vehicles" && (
                    <VehicleForm onClose={onClose} onAddSuccess={onAddSuccess} />
                )}
            </div>
        </div>
    );
}