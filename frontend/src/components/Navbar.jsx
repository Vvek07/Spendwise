import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, PieChart, CreditCard, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="glass-panel navbar">
            <div className="flex items-center gap-2">
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
                    <PieChart color="white" size={24} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    SpendWise
                </span>
            </div>

            <div className="flex items-center gap-8">
                <Link to="/dashboard" className="nav-link">
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/expenses" className="nav-link">
                    <CreditCard size={18} /> Expenses
                </Link>
                <Link to="/budgets" className="nav-link">
                    <PieChart size={18} /> Budgets
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="btn-outline"
                    style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} style={{ color: 'var(--text-muted)' }} />}
                </button>

                <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{user.name}</span>
                <button
                    onClick={handleLogout}
                    className="btn-danger-ghost flex items-center gap-1"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
