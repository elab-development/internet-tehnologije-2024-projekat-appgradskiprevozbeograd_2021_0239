// src/components/StationsTab.jsx (Ažurirano za Paginaciju)

import React, {useCallback, useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import {fetchAllStations} from "../api/user.js";

const initialPagination = {
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
};

export default function StationsTab({setSelectedStation, currentStations, setStations, selectedStation}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState(initialPagination);



    const currentPage = paginationData.current_page;
    const lastPage = paginationData.last_page;

    const loadStations = useCallback(async (pageToLoad) => {
        setLoading(true);
        setError(null);
        try {
            // POZIVAMO API SA TRENUTNOM STRANICOM
            const result = await fetchAllStations(pageToLoad);

            // Provera da li je rezultat validan paginirani objekat
            if (!result || !Array.isArray(result.data)) {
                throw new Error("Neispravan format podataka sa servera.");
            }

            // Podaci za prikaz (koji idu u currentStations / stations u HomeUser-u)
            const newStations = result.data;

            // Azuriramo stanje stanica u HomeUser-u (ako je stations prazan)
            // U slucaju paginacije, stations u HomeUser-u uvek treba da drzi samo trenutnu stranicu!
            setStations(newStations);

            setPaginationData({
                data: newStations,
                current_page: result.meta.current_page,
                last_page: result.meta.last_page,
                total: result.meta.total,
            });

            // Postavljamo prvu stanicu kao default selektovanu
            if (newStations.length > 0) {
                setSelectedStation(newStations[0]);
            } else {
                setSelectedStation({ id: 0, name: 'Izaberite Stanicu' });
            }
        } catch (err) {
            console.error("Greška pri dohvatu stranice " + pageToLoad + ":", err);
            setError("Neuspešno učitavanje stanica. Pokušajte ponovo.");
            setStations([]);
            setPaginationData(initialPagination);
            setSelectedStation({ id: 0, name: 'Izaberite Stanicu' });
        } finally {
            setLoading(false);
        }
    }, [setStations, setSelectedStation]);

    useEffect(() => {
        if (currentStations.length === 0 && paginationData.total === 0) {
            loadStations(1);
        }
    }, [loadStations, currentStations.length, paginationData.total]);

    const handlePageChange = (page) => {
        // Uvek proveravamo da stranica ne ide ispod 1 ili iznad poslednje
        if (page < 1 || page > lastPage || page === currentPage) return;
        loadStations(page);
    };


    // Helper funkcija za generisanje brojeva stranica
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
            <h2 /* ... stilovi ... */ >
                Sve Stanice (Ukupno: {paginationData.total})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading && <div>Učitavanje...</div>}
                {error && <div style={{ color: '#EF4444', fontWeight: '600' }}>Greška: {error}</div>}

                {(!loading && Array.isArray(currentStations) && currentStations.length === 0) && !error && <div>Nema stanica</div>}

                {(Array.isArray(currentStations) ? currentStations : []).map((station) => (
                    <motion.div
                        key={station.id}
                        onClick={() => setSelectedStation(station)}
                        style={{ /* ... stilovi ... */ }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <h3 /* ... */ >{station.name}</h3>
                                <p /* ... */ >{station.address}</p>
                                <p /* ... */ >Kod: {station.stop_code}</p>
                            </div>
                            {selectedStation?.id === station.id && (
                                <Star style={{ width: '20px', height: '20px', color: '#3B82F6', fill: '#3B82F6' }} />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {lastPage > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>

                    {/* Dugme PRETHODNA */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
                            background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px',
                            cursor: 'pointer', transition: 'all 0.15s',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={16} /> Prethodna
                    </button>

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            style={{
                                padding: '8px 12px', borderRadius: '8px', fontWeight: '600',
                                background: page === currentPage ? '#3B82F6' : 'white',
                                color: page === currentPage ? 'white' : '#1F2937',
                                border: `1px solid ${page === currentPage ? '#3B82F6' : '#E5E7EB'}`,
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
                            background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px',
                            cursor: 'pointer', transition: 'all 0.15s',
                            opacity: currentPage === lastPage ? 0.5 : 1
                        }}
                    >
                        Sledeća <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </motion.div>
    );
}