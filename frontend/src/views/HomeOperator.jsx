import { useState, useEffect } from "react";
import { Navigation, CheckCircle } from "lucide-react";
import axiosClient from "../axios-client.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

export default function HomeOperator() {
    const [user, setUser] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [latitude, setLatitude] = useState("44.8154");
    const [longitude, setLongitude] = useState("20.4462");
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axiosClient.get("/me");
                setUser(userRes.data);

                const vehiclesRes = await axiosClient.get(`/vehicles/driver/${userRes.data.id}`);
                setVehicles(vehiclesRes.data.vehicles);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdateWithGPS = () => {
        if (!selectedVehicle) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);

                    setLatitude(lat);
                    setLongitude(lng);

                    try {
                        await axiosClient.put(`/vehicle_positions/${selectedVehicle.id}`, {
                            latitude: lat,
                            longitude: lng,
                        });
                        setUpdateSuccess(true);
                        setTimeout(() => setUpdateSuccess(false), 3000);
                    } catch (err) {
                        console.error(err);
                        alert("Greška prilikom ažuriranja pozicije");
                    }
                },
                (error) => console.error(error)
            );
        } else {
            alert("GPS nije dostupan u ovom pretraživaču");
        }
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 16px" }}>
            {/* Vozila */}
            <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
                    Moja Vozila
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            onClick={() => setSelectedVehicle(vehicle)}
                            style={{
                                padding: "16px",
                                borderRadius: "8px",
                                border: `2px solid ${selectedVehicle?.id === vehicle.id ? "#F97316" : "#E5E7EB"}`,
                                background: selectedVehicle?.id === vehicle.id ? "#FFF7ED" : "white",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                    background: "linear-gradient(to bottom right, #F97316, #DC2626)",
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                }}>
                                    {vehicle.line.code}
                                </div>
                                <div style={{ flex: 1 }}>{vehicle.vehicle_code}</div>
                                <div style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: vehicle.active === 1 ? "#10B981" : "#EAB308",
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dugme za GPS */}
            <div style={{ marginTop: "16px" }}>
                <button
                    onClick={handleUpdateWithGPS}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        background: '#F97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    <Navigation style={{ width: '20px', height: '20px' }} />
                    Ažuriraj Poziciju GPS-om
                </button>

                {updateSuccess && (
                    <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <CheckCircle style={{ color: '#16A34A' }} />
                        Pozicija vozila uspešno ažurirana!
                    </div>
                )}
            </div>

            {/* Mapa */}
            {selectedVehicle && (
                <div style={{ marginTop: "24px" }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Lokacija Vozila</h3>
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                        key={selectedVehicle.id}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={[latitude, longitude]}
                            icon={createLineIcon(selectedVehicle.line.code)}
                        >
                            <Popup>
                                Vozilo: {selectedVehicle.vehicle_code} <br />
                                Linija: {selectedVehicle.line.code}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
}