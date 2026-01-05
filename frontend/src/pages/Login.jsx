import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ flex: 1, padding: '1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '450px', position: 'relative', overflow: 'hidden' }}>
                <div className="bg-gradient-header"></div>

                <h2 className="text-3xl font-bold text-center" style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p className="text-muted text-center" style={{ marginBottom: '2rem' }}>Sign in to manage your expenses</p>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fee2e2' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                        style={{ marginTop: '0.5rem' }}
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center text-muted" style={{ marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
