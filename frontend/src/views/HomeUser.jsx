import React, {useCallback, useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Bus, Navigation, Clock } from 'lucide-react';

import StationsTab from '../components/user/StationsTab.jsx';
import LinesTab from '../components/user/LinesTab.jsx';
import MapTab from '../components/user/MapTab.jsx';
import ArrivalsPanel from "../components/user/ArrivalsPanel.jsx";

const initialSelectedStation = {
    id: 0,
    name: 'Izaberite Stanicu',
};


export default function HomeUser(){
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('stations');
    const [displayedStations, setDisplayedStations] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedStation, setSelectedStation] = useState(initialSelectedStation);

    const [stations, setStations] = useState([]);

    useEffect(() => {
        setDisplayedStations(stations);
        setIsSearching(false);
        setSelectedStation(initialSelectedStation);
    }, [stations]);

    const filterStations = useCallback(() => {
        const query = searchQuery.trim().toLowerCase();

        if (query.length === 0) {
            setDisplayedStations(stations);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const filtered = stations.filter(station => {
            const codeMatch = station.stop_code?.toLowerCase().includes(query);
            const nameMatch = station.name?.toLowerCase().includes(query);
            return codeMatch || nameMatch;
        });
        setDisplayedStations(filtered);
        if (filtered.length > 0) {
            setSelectedStation(filtered[0]);
        } else {
            setSelectedStation(initialSelectedStation);
        }
        setIsSearching(false);
    }, [searchQuery, stations]);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (activeTab === 'stations') {
                filterStations();
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);

    }, [searchQuery, activeTab, filterStations]);




    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}

            >
                <div style={{ position: 'relative', marginBottom: '24px',

                    background: 'white', // DODATO: Bela pozadina
                    padding: '4px',     // DODATO: Padding 4px
                    borderRadius: '12px', // DODATO: Zaobljene ivice
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // DODATO: Senka
                }}>
                    <Search
                        style={{
                            position: 'absolute',
                            // Korigovana pozicija zbog paddinga od 4px na roditelju
                            left: '20px', // Originalnih 16px + 4px roditeljskog paddinga
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: '#9CA3AF',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Pretražite stanice po kodu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            background: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                            borderRadius: '8px',
                            paddingLeft: '44px',
                            paddingRight: '12px',
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            outline: 'none',
                            transition: 'all 0.15s',
                            fontSize: '16px',
                            lineHeight: '1.5',
                        }}
                    />
                    {isSearching &&(
                        <span style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color:'#3B82F6'
                        }}>
                                Učitavanje...
                            </span>
                    )
                    }
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
                    <div>
                        {activeTab === 'stations' && (
                            <StationsTab
                                selectedStation={selectedStation}
                                setSelectedStation={setSelectedStation}
                                currentStations={displayedStations}
                                setStations={setStations}
                                isSearchActive={searchQuery.trim().length > 0}
                                searchQuery={searchQuery}
                                // isSearchingActive={isSearching||searchQuery.length> 0}
                            />
                        )}
                        {
                            activeTab==='lines' && (
                                <LinesTab stationId={selectedStation.id}/>
                            )
                        }
                        {
                            activeTab==='map' && (
                                <MapTab station={selectedStation}/>
                            )
                        }



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