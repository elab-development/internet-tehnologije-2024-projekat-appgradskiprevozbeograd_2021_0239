// src/components/StationsList.jsx
import React, { useEffect, useState } from 'react';
import { Trash2, MapPin } from 'lucide-react';
import axiosClient from "../../axios-client.js";

export default function StationsList({ api }) {
    const PAGE_SIZE = 5;

    const [stations, setStations] = useState([]);         // currently shown page data
    const [allStations, setAllStations] = useState([]);   // only when server doesn't paginate
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

// pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [serverPagination, setServerPagination] = useState(false); // true if backend paginates

    // load function supports server pagination via ?page= param if available
    async function load(p = 1) {
        try {
            setLoading(true);

            setError(null);

            // Try server-side pagination first (send page param)
            const res = await axiosClient.get('/stations', { params: { page: p } });

            // Common Laravel paginator shapes:
            // 1) res.data.data -> could be array OR paginator object (with data/meta)
            // 2) res.data.stations -> array
            // 3) res.data -> array

            // Narrow down payloads
            const d = res.data;

            // Case A: Laravel paginator wrapper: res.data.data is object with .data array and meta
            if (d && d.data && Array.isArray(d.data.data)) {
                // Example: { data: { data: [...], current_page, last_page, total } }
                const pageData = d.data.data;
                setStations(pageData);
                setServerPagination(true);
                setPage(d.data.current_page || p);
                setTotalPages(d.data.last_page || Math.ceil((d.data.total || pageData.length) / PAGE_SIZE));
                setTotalItems(d.data.total || pageData.length);
                return;
            }

            // Case B: Laravel resource collection: res.data.data is array
            if (d && Array.isArray(d.data)) {
                // backend returned { data: [...] } with full array (no meta)
                const arr = d.data;
                setAllStations(arr);
                setServerPagination(false);
                setTotalItems(arr.length);
                setTotalPages(Math.max(1, Math.ceil(arr.length / PAGE_SIZE)));
                // slice for page
                const start = (p - 1) * PAGE_SIZE;
                setStations(arr.slice(start, start + PAGE_SIZE));
                setPage(p);
                return;
            }

            // Case C: backend returned res.data.stations
            if (d && Array.isArray(d.stations)) {
                const arr = d.stations;
                setAllStations(arr);
                setServerPagination(false);
                setTotalItems(arr.length);
                setTotalPages(Math.max(1, Math.ceil(arr.length / PAGE_SIZE)));
                const start = (p - 1) * PAGE_SIZE;
                setStations(arr.slice(start, start + PAGE_SIZE));
                setPage(p);
                return;
            }

            // Case D: backend returned array directly (res.data is array)
            if (Array.isArray(d)) {
                const arr = d;
                setAllStations(arr);
                setServerPagination(false);
                setTotalItems(arr.length);
                setTotalPages(Math.max(1, Math.ceil(arr.length / PAGE_SIZE)));
                const start = (p - 1) * PAGE_SIZE;
                setStations(arr.slice(start, start + PAGE_SIZE));
                setPage(p);
                return;
            }

            // Case E: maybe res.data.data is object containing array under other key — try to find first array
            if (d && typeof d === 'object') {
                // try first array property inside d
                const arrKey = Object.keys(d).find(k => Array.isArray(d[k]));
                if (arrKey) {
                    const arr = d[arrKey];
                    setAllStations(arr);
                    setServerPagination(false);
                    setTotalItems(arr.length);
                    setTotalPages(Math.max(1, Math.ceil(arr.length / PAGE_SIZE)));
                    const start = (p - 1) * PAGE_SIZE;
                    setStations(arr.slice(start, start + PAGE_SIZE));
                    setPage(p);
                    return;
                }
            }

            // fallback: no recognizable data
            setStations([]);
            setAllStations([]);
            setTotalItems(0);
            setTotalPages(1);
            setPage(1);

        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || 'Greška pri učitavanju stanica');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(1); }, []);

    // when user changes page
    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        // if server-pagination enabled, request that page; otherwise slice client-side
        if (serverPagination) {
            load(p);
        } else {
            // client-side: just slice from allStations
            const start = (p - 1) * PAGE_SIZE;
            setStations(allStations.slice(start, start + PAGE_SIZE));
            setPage(p);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // delete handler - prefer backend helper if passed via props.api, otherwise call axiosClient directly

    async function handleDelete(id) {
        if (!window.confirm('Obriši stanicu?')) return;
        try {
            if (api && typeof api.deleteStation === 'function') {
                await api.deleteStation(id);
            } else {
                // try common delete endpoint
                await axiosClient.delete(`/station/delete/${id}`);
            }
            // after delete refresh current page
            // if server-pagination, reload same page; else remove from local array
            if (serverPagination) {
                load(page);
            } else {
                const newAll = allStations.filter(s => s.id !== id);
                setAllStations(newAll);
                const start = (page - 1) * PAGE_SIZE;
                setStations(newAll.slice(start, start + PAGE_SIZE));
                setTotalItems(newAll.length);
                setTotalPages(Math.max(1, Math.ceil(newAll.length / PAGE_SIZE)));
            }
        } catch (err) {
            console.error(err);
            alert('Neuspeh pri brisanju');
        }
    }

    if (loading) return <div style={{ padding: 24 }}>Učitavanje stanica...</div>;
    if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stations.map(station => (
                    <div key={station.id} style={{
                        padding: 16, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ background: 'linear-gradient(to bottom right, #10B981, #059669)', padding: 12, borderRadius: 8 }}>
                                <MapPin style={{ width: 24, height: 24, color: 'white' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{station.name}</h3>
                                <p style={{ margin: 0, color: '#6B7280' }}>{station.address}</p>
                                <p style={{ margin: 0, color: '#9CA3AF' }}>Kod: {station.stop_code}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ padding: 8 }} title="Obriši" onClick={() => handleDelete(station.id)}><Trash2 style={{ width: 20, height: 20 }} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination controls */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#6B7280' }}>
                    Prikazano {stations.length} od {totalItems} stanica
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => goToPage(page - 1)} disabled={page <= 1} style={{ padding: '6px 10px' }}>Prethodna</button>

                    {/* show a few page numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        // show only near current page if too many pages
                        if (totalPages > 7 && Math.abs(p - page) > 3 && p !== 1 && p !== totalPages) return null;
                        return (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                style={{
                                    padding: '6px 10px',
                                    background: p === page ? '#A855F7' : 'transparent',
                                    color: p === page ? 'white' : '#111827',
                                    borderRadius: 6,
                                    border: '1px solid #E5E7EB'
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}

                    <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} style={{ padding: '6px 10px' }}>Sledeća</button>
                </div>
            </div>
        </div>
    );
}