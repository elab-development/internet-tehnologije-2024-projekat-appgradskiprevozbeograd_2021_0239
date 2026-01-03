
import {Link, Navigate, Outlet,useNavigate} from "react-router-dom";

import {useStateContext} from "../context/ContextProvider.jsx";
import {
    Bus,
    LogOut
} from 'lucide-react'


export default function DefaultLayout() {

    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    console.log("user:", user);
    console.log("token:", token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    const handleLogout = () => {
        setToken(null);
        setUser(null);
        navigate("/login");
    };
    const displayName = user?.name || "Korisnik";

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <header style={{
                background: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #E5E7EB'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            background: 'linear-gradient(to bottom right, #A855F7, #EC4899)',
                            padding: '8px',
                            borderRadius: '8px'
                        }}>
                            <Bus style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <div >
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#111827',
                                lineHeight: '1.2'
                            }}>Beograd Plus</h1>
                            <p style={{
                                fontSize: '16px',
                                color: '#6B7280',
                                lineHeight: '1.5'
                            }}>Dobrodošli, {displayName}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            color: '#374151',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s',
                            fontSize: '16px',
                            lineHeight: '1.5'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut style={{ width: '20px', height: '20px' }} />
                        Odjavi se
                    </button>
                </div>
            </header>

            <main>
                <Outlet/>

            </main>
        </div>
    );
}



