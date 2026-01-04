import {useEffect, useState} from "react";
import { Route as RouteIcon, MapPin, Bus, Clock } from 'lucide-react';
// import * as PropTypes from "prop-types"; // Nije potrebno ako ga ne koristite
import AddModal from "../components/admin/AddModal.jsx";
import NavTabs from "../components/admin/NavTabs.jsx";
import axiosClient from "../axios-client.js";
import StatCards from "../components/admin/StatCards.jsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

export default function HomeAdmin(){
    const [showAddModal, setShowAddModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const pathSegments = location.pathname.split('/').filter(p => p);

    const currentSection = pathSegments[pathSegments.length - 1] === 'admin'
        ? 'lines'
        : pathSegments[pathSegments.length - 1];

    const refreshData = () => {
        navigate(0);
    };

    const [stats, setStats] = useState([
        { label: 'Ukupno Linija', value: '—', icon: RouteIcon, color: 'linear-gradient(to bottom right, #3B82F6, #4F46E5)' },
        { label: 'Ukupno Stanica', value: '—', icon: MapPin, color: 'linear-gradient(to bottom right, #10B981, #059669)' },
        { label: 'Aktivnih Vozila', value: '—', icon: Bus, color: 'linear-gradient(to bottom right, #F97316, #DC2626)' },
        { label: 'Putovanja Danas', value: '—', icon: Clock, color: 'linear-gradient(to bottom right, #A855F7, #EC4899)' },
    ]);

    // ... (useEffect za fetchStats ostaje nepromenjen) ...

    useEffect(() => {
        let mounted = true;

        const extractArray = (resp) => {
            if (!resp || resp.status !== 'fulfilled') return null;
            const val = resp.value && resp.value.data;

            if (!val) return null;

            if (Array.isArray(val)) return val;

            const candidates = ['lines', 'stations', 'vehicles', 'data', 'items', 'payload'];
            for (const key of candidates) {
                if (val[key] && Array.isArray(val[key])) return val[key];
            }

            for (const k of Object.keys(val)) {
                if (Array.isArray(val[k])) return val[k];
            }

            return null;
        };

        const fetchStats = async () => {
            try {
                const results = await Promise.allSettled([
                    axiosClient.get('/lines'),
                    axiosClient.get('/stations/all'),
                    axiosClient.get('/vehicles'),
                    axiosClient.get('/trip/status/scheduled'), // prilagodi ako imaš poseban endpoint za danas
                ]);

                if (!mounted) return;


                console.log('stats results:', results);

                const linesArr = extractArray(results[0]) || [];
                const stationsArr = extractArray(results[1]) || [];
                const vehiclesArr = extractArray(results[2]) || [];
                const tripsArr = extractArray(results[3]) || [];

                const activeVehiclesCount = vehiclesArr.length > 0
                    ? vehiclesArr.filter(v => {
                        // moguće varijante: v.status === 'active' ili v.active === 1/true ili v.active === '1'
                        const s = (v.status || '').toString().toLowerCase();
                        const a = (v.active === undefined) ? null : v.active;
                        if (s === 'active' || s === 'aktivno') return true;
                        if (a === 1 || a === '1' || a === true) return true;
                        return false;
                    }).length
                    : 0;

                setStats([
                    { label: 'Ukupno Linija', value: linesArr.length || 0, icon: RouteIcon, color: 'linear-gradient(to bottom right, #3B82F6, #4F46E5)' },
                    { label: 'Ukupno Stanica', value: stationsArr.length || 0, icon: MapPin, color: 'linear-gradient(to bottom right, #10B981, #059669)' },
                    { label: 'Aktivnih Vozila', value: activeVehiclesCount, icon: Bus, color: 'linear-gradient(to bottom right, #F97316, #DC2626)' },
                    { label: 'Putovanja Danas', value: tripsArr.length || 0, icon: Clock, color: 'linear-gradient(to bottom right, #A855F7, #EC4899)' },
                ]);
            } catch (err) {
                console.error('fetchStats error', err);
                if (!mounted) return;
            }
        };

        fetchStats();

        return () => { mounted = false; };
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>

                <StatCards stats={stats} />
                <NavTabs
                    active={currentSection}
                    setActive={(section) => navigate(`/admin/${section}`)}
                />

                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>

                    <div style={{ padding: 24, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: 20 }}>
                            {currentSection === 'lines' && 'Upravljanje Linijama'}
                            {currentSection === 'stations' && 'Upravljanje Stanicama'}
                            {currentSection === 'trips' && 'Upravljanje Putovanjima'}
                            {currentSection === 'vehicles' && 'Upravljanje Vozilima'}
                        </h2>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(to right, #A855F7, #EC4899)', color: 'white', border: 'none' }}
                            >
                                Dodaj Novo
                            </button>
                        </div>
                    </div>

                    <div>
                        <Outlet/>
                    </div>
                </div>
            </div>

            <AddModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                activeSection={currentSection}
                onAddSuccess={refreshData}
            />
        </div>
    );
}