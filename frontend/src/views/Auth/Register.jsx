import {motion} from "framer-motion";
import {Bus, BusFront, Lock, LogIn, User, UserCog, UserSquare} from "lucide-react";
import {useState} from "react";
import {useStateContext} from "../../context/ContextProvider.jsx";
import {Link, useNavigate} from "react-router-dom";
import axiosClient from "../../axios-client.js";

export default function Register(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role_id, setRoleId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        axiosClient
            .post("/register", { name,email, password,role_id })
            .then(({ data }) => {
                console.log(data);
                setToken(data.token);
                setUser(data.user);
                if (data.user.role_id === '1') {
                    navigate("/admin/home");
                }
                if (data.user.role_id === '2') {
                    navigate("/operator/home");
                }
                if (data.user.role_id === '3') {
                    navigate("/user/home");

                }
            })
            .catch((err) => {
                console.log(err.message);

                const backendError = err?.message || "Greška prilikom registracije";
                setError(backendError);
            })
            .finally(() => setIsLoading(false));
    };

    const roles = [
        { key: '1', label: 'Administrator', Icon: UserCog },
        { key: '2', label: 'Vozač', Icon: BusFront },
        { key: '3', label: 'Korisnik', Icon: UserSquare },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #2563EB, #4F46E5, #9333EA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin:0,
            padding:0
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '448px' }}
            >
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '32px',


                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(to bottom right, #3B82F6, #4F46E5)',
                                borderRadius: '50%',
                                marginBottom: '16px'
                            }}
                        >
                            <Bus style={{ width: '32px', height: '32px', color: 'white' }} />
                        </motion.div>
                        <h1 style={{
                            fontSize: '30px',
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: '8px',
                            lineHeight: '1.2'
                        }}>Beograd Plus</h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#6B7280',
                            lineHeight: '1.5'
                        }}>Sistem za praćenje gradskog prevoza</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex'
                        , flexDirection: 'column',
                        gap: '24px',
                        width: '100%',
                        maxWidth: "100%",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        padding: "0px"     }}>
                        <div>
                            <label htmlFor="name" style={{
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px',
                                lineHeight: '1.5'
                            }}>
                                Ime i prezime
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#9CA3AF'
                                }} />
                                <input
                                    id="name"
                                    type="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        maxWidth: "100%",
                                        boxSizing: "border-box",
                                        paddingLeft: '44px',
                                        paddingRight: '10px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        outline: 'none',
                                        transition: 'all 0.15s',
                                        fontSize: '16px',
                                        lineHeight: '1.5'
                                    }}
                                    placeholder="Vaše ime i prezime"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3B82F6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px',
                                lineHeight: '1.5'
                            }}>
                                Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#9CA3AF'
                                }} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        maxWidth: "100%",
                                        boxSizing: "border-box",                                         paddingLeft: '44px',
                                        paddingRight: '10px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        outline: 'none',
                                        transition: 'all 0.15s',
                                        fontSize: '16px',
                                        lineHeight: '1.5'
                                    }}
                                    placeholder="vas.email@example.com"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3B82F6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px',
                                lineHeight: '1.5'
                            }}>
                                Lozinka
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#9CA3AF'
                                }} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: "100%",
                                        maxWidth: "100%",
                                        boxSizing: "border-box",                                        paddingLeft: '44px',
                                        paddingRight: '16px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        outline: 'none',
                                        transition: 'all 0.15s',
                                        fontSize: '16px',
                                        lineHeight: '1.5'
                                    }}
                                    placeholder="••••••••"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3B82F6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>
                        <div>


                            <div style={{
                                display: 'flex',
                                width: '100%',
                                background: '#F3F4F6',
                                borderRadius: '8px',
                                padding: '4px',
                                position: 'relative'
                            }}>
                                {role_id && (
                                    <motion.div
                                        layoutId="role-indicator"
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            bottom: '4px',
                                            borderRadius: '6px',
                                            background: 'white',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                                            zIndex: 0
                                        }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}

                                {roles.map((item) => {
                                    const isActive = role_id === item.key;
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => setRoleId(item.key)}
                                            style={{
                                                flexGrow: 1,
                                                padding: '8px 4px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                zIndex: 1,
                                                transition: 'color 0.2s',
                                                color: isActive ? '#111827' : '#6B7280',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {item.Icon && <item.Icon style={{ width: '18px', height: '18px' }} />}
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    padding: '12px',
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    borderRadius: '8px',
                                    color: '#DC2626',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    lineHeight: '1.5'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                background: isLoading ? '#9CA3AF' : 'linear-gradient(to right, #2563EB, #4F46E5)',
                                color: 'white',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                lineHeight: '1.5'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = 'linear-gradient(to right, #1D4ED8, #4338CA)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = 'linear-gradient(to right, #2563EB, #4F46E5)';
                                }
                            }}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid white',
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%'
                                    }}
                                />
                            ) : (
                                <>
                                    <LogIn style={{ width: '20px', height: '20px' }} />
                                    Registrujte se
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Imate profil?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                            >
                                Prijavite se
                            </Link>
                        </p>


                    </form>

                </div>
            </motion.div>
        </div>
    );
}