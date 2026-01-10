import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fetchAllStations, searchStations } from "../../api/user.js";

const initialSelectedStation = {
    id: 0,
    name: 'Izaberite Stanicu',
};

export default function StationsTab({
                                        setSelectedStation,
                                        currentStations,
                                        setStations,
                                        selectedStation,
                                        isSearchActive,
                                        searchQuery
                                    }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const { current_page: currentPage, last_page: lastPage } = paginationData;

    // --- FUNKCIJA ZA UČITAVANJE STANICA ---
    const loadStations = useCallback(
        async (pageToLoad = 1, query = "") => {
            setLoading(true);
            setError(null);
            try {
                if (query && query.length > 0) {
                    // SEARCH – full search po svim stanicama
                    const stations = await searchStations(query);
                    console.log("Rezultati pretrage sa bekenda:", stations); // DODAJ OVO
                    setStations(stations);
                    setPaginationData({ current_page: 1, last_page: 1, total: stations.length });

                    if (stations.length > 0) setSelectedStation(stations[0]);
                    else setSelectedStation(initialSelectedStation);
                } else {
                    // REGULARNA LISTA – paginacija
                    const result = await fetchAllStations(pageToLoad);
                    const newStations = result.data;
                    setStations(prev => pageToLoad === 1 ? newStations : [...prev, ...newStations]);
                    setPaginationData({
                        current_page: result.meta.current_page,
                        last_page: result.meta.last_page,
                        total: result.meta.total,
                    });

                    if (newStations.length > 0 && pageToLoad === 1) setSelectedStation(newStations[0]);
                    else if (pageToLoad === 1) setSelectedStation(initialSelectedStation);
                }
            } catch (err) {
                console.error("Greška pri dohvatu stanica:", err);
                setError("Neuspešno učitavanje stanica. Pokušajte ponovo.");
            } finally {
                setLoading(false);
            }
        },
        [setStations, setSelectedStation]
    );

    // --- useEffect sa async funkcijom ---
    useEffect(() => {
        const fetchStations = async () => {
            await loadStations(1, isSearchActive ? searchQuery : "");
        };
        fetchStations();
    }, [isSearchActive, searchQuery, loadStations]);

    // --- Dugme "Prikaži više" ---
    const handleLoadMore = async () => {
        if (currentPage < lastPage) {
            await loadStations(currentPage + 1);
        }
    };

    const showLoadMore = !isSearchActive && currentStations.length >= 5 && currentPage < lastPage;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
            <h2>Sve Stanice</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading && !isSearchActive && <div>Učitavanje...</div>}
                {error && <div style={{ color: '#EF4444', fontWeight: '600' }}>Greška: {error}</div>}
                {(!loading && Array.isArray(currentStations) && currentStations.length === 0 && !error) &&
                    <div>Nema stanica</div>
                }

                {currentStations.map((station) => (
                    <motion.div
                        key={station.id}
                        onClick={() => setSelectedStation(station)}
                        style={{
                            padding: '16px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            border: `2px solid ${selectedStation.id === station.id ? '#3B82F6' : 'transparent'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <h3>{station.name}</h3>
                                <p>{station.address}</p>
                                <p>Kod: {station.stop_code}</p>
                            </div>
                            {selectedStation?.id === station.id && (
                                <Star style={{ width: '20px', height: '20px', color: '#3B82F6', fill: '#3B82F6' }} />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {showLoadMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            background: '#3B82F6',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                    >
                        {loading ? 'Učitavanje...' : 'Prikaži više'}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
