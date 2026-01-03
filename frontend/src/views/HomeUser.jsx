import React, { useState} from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Bus, Navigation, Clock } from 'lucide-react';

import StationsTab from '../components/StationsTab.jsx';
import LinesTab from '../components/LinesTab.jsx';
import MapTab from '../components/MapTab.jsx';
import {  searchStations } from "../api/user.js";
import ArrivalsPanel from "../components/ArrivalsPanel.jsx";

const initialSelectedStation = {
    id: 0,
    name: 'Izaberite Stanicu',
};


export default function HomeUser(){
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('stations');


    const [selectedStation, setSelectedStation] = useState(initialSelectedStation);

    const [stations, setStations] = useState([]);





    const handleSearch = async () => {
        if (activeTab === 'stations' && searchQuery.trim().length > 0) {
            try {
                const searchResults = await searchStations(searchQuery.trim());
                setStations(searchResults);

                if (searchResults.length > 0) {
                    setSelectedStation(searchResults[0]);
                } else {
                    setSelectedStation(initialSelectedStation);
                }
            } catch (err) {
                console.error("Greška prilikom pretrage stanica:", err);
                setStations([]);
                setSelectedStation(initialSelectedStation);
            }
        } else if (activeTab === 'lines') {
            console.log("Pretraga linija nije implementirana.");
        }
    };
    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '24px' }}
            >
                <div style={{ position: 'relative' }}>
                    <Search
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: '#9CA3AF',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Pretražite linije ili stanice..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                        style={{
                            width: '100%',
                            paddingLeft: '48px',
                            paddingRight: '16px',
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            outline: 'none',
                            transition: 'all 0.15s',
                            fontSize: '16px',
                            lineHeight: '1.5',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3B82F6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#E5E7EB';
                            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }}
                    />
                </div>
            </motion.div>

            {/* Tab Navigation (ostaje u roditelju) */}
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    background: 'white',
                    padding: '4px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
            >
                {[
                    { key: 'stations', icon: MapPin, label: 'Stanice' },
                    { key: 'lines', icon: Bus, label: 'Linije' },
                    { key: 'map', icon: Navigation, label: 'Mapa' },
                ].map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            background: activeTab === key ? 'linear-gradient(to right, #3B82F6, #4F46E5)' : 'transparent',
                            color: activeTab === key ? 'white' : '#6B7280',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            boxShadow: activeTab === key ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            lineHeight: '1.5',
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== key) e.currentTarget.style.background = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== key) e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Icon style={{ width: '20px', height: '20px' }} />
                        {label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <style>
                    {`
                    @media (min-width: 1024px) {
                        .dashboard-grid {
                            grid-template-columns: 2fr 1fr;
                        }
                    }
                    `}
                </style>

                <div
                    className="dashboard-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '24px',
                    }}
                >
                    {}
                    <div>
                        {activeTab === 'stations' && (
                            <StationsTab
                                selectedStation={selectedStation}
                                setSelectedStation={setSelectedStation}
                                currentStations={stations}
                                setStations={setStations}
                            />
                        )}




                    </div>

                    {/* Sidebar - Real-time Arrivals (ostaje u roditelju) */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                padding: '24px',
                                position: 'sticky',
                                top: '24px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Clock style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', lineHeight: '1.2' }}>
                                    Dolasci - {selectedStation.name}
                                </h3>
                            </div>

                            <div>
                                <ArrivalsPanel station={selectedStation} pollInterval={30000}/>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}