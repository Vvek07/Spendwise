import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, DollarSign } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(name, email, password, currency);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ flex: 1, padding: '1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative', overflow: 'hidden' }}>
                <div className="bg-gradient-header"></div>

                <h2 className="text-3xl font-bold text-center" style={{ marginBottom: '0.5rem' }}>Create Account</h2>
                <p className="text-muted text-center" style={{ marginBottom: '2rem' }}>Start your journey to financial freedom</p>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fee2e2' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                            <label className="label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User className="text-light" size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Currency</label>
                            <div style={{ position: 'relative' }}>
                                <DollarSign className="text-light" size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="input"
                                    style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail className="text-light" size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock className="text-light" size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ marginTop: '0.5rem', background: '#0f172a', color: 'white' }}
                    >
                        Create Account <UserPlus size={18} />
                    </button>
                </form>

                <p className="text-center text-muted" style={{ marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
