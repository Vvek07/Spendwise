import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [budgetModalOpen, setBudgetModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            const [expRes, budgetRes] = await Promise.all([
                api.get('/expenses'),
                api.getBudgets(currentMonth)
            ]);
            setExpenses(expRes.data);
            if (budgetRes.data && budgetRes.data.length > 0) {
                setBudget(budgetRes.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetBudget = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                amount: parseFloat(newBudget),
                month: new Date().toISOString().slice(0, 7)
            };
            const res = await api.setBudget(payload);
            setBudget(res.data);
            setBudgetModalOpen(false);
        } catch (error) {
            console.error("Failed to set budget", error);
        }
    }

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate Trends (Simple implementation: Compare first half of month vs second or just show current)
    // Note: For real month-over-month, we'd need to fetch last month's data too. 
    // For now, let's calculate simplistic trend based on available data or remove hardcode.
    // Better: Fetch previous month expenses to be accurate.

    // Budget Calculations
    const budgetAmount = budget ? budget.amount : 0;
    const progress = budgetAmount > 0 ? (totalExpense / budgetAmount) * 100 : 0;
    const progressColor = progress > 100 ? '#ef4444' : progress > 80 ? '#f59e0b' : '#10b981';

    // Trends Mock Calculation (Refined for demo purposes if no prev data)
    // In a real app we would fetch: api.get('/expenses?month=lastMonth')
    const trendText = "Track your daily spending";
    const trendColor = "#64748b";

    const categoryData = expenses.reduce((acc, curr) => {
        const categoryName = curr.category ? curr.category.name : 'Uncategorized';
        const existing = acc.find(item => item.name === categoryName);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: categoryName, value: curr.amount, color: curr.category?.color || '#cbd5e1' });
        }
        return acc;
    }, []);

    const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

    if (loading) return <div className="text-center" style={{ padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted">Overview of your financial activity</p>
                </div>
                <button onClick={() => setBudgetModalOpen(true)} className="btn btn-outline">
                    {budget ? 'Update Budget' : 'Set Budget'}
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel card">
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <p className="text-muted font-medium" style={{ marginBottom: '0.25rem' }}>Total Expenses</p>
                        <h3 className="text-3xl font-bold">
                            {user.currency} {totalExpense.toFixed(2)}
                        </h3>
                        <div className="flex items-center gap-1 font-medium" style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: trendColor }}>
                            <TrendingUp size={16} /> <span>{trendText}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel card">
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <p className="text-muted font-medium" style={{ marginBottom: '0.25rem' }}>Monthly Budget</p>
                        <h3 className="text-3xl font-bold">
                            {budgetAmount > 0 ? `${user.currency} ${budgetAmount.toFixed(2)}` : 'Not Set'}
                        </h3>

                        {budgetAmount > 0 ? (
                            <>
                                <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.5rem', borderRadius: '9999px', marginTop: '0.75rem', overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: progressColor, height: '100%', width: `${Math.min(progress, 100)}%`, borderRadius: '9999px', transition: 'width 0.5s ease' }}></div>
                                </div>
                                <p className="text-light" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{progress.toFixed(1)}% used</p>
                            </>
                        ) : (
                            <p className="text-light" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Set a limit to track savings</p>
                        )}
                    </div>
                </div>

                <div className="glass-panel card">
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <p className="text-muted font-medium" style={{ marginBottom: '0.25rem' }}>Recent Activity</p>
                        <h3 className="text-3xl font-bold">
                            {expenses.length}
                        </h3>
                        <p className="text-light" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Transactions this month</p>
                    </div>
                </div>
            </div>

            {/* Set Budget Modal */}
            {budgetModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h3 className="text-xl font-bold mb-4">Set Monthly Budget</h3>
                        <form onSubmit={handleSetBudget}>
                            <div className="input-group">
                                <label className="label">Budget Amount ({user.currency})</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setBudgetModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Budget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel card" style={{ minHeight: '400px' }}>
                    <h3 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Expense Breakdown</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                                No data available
                            </div>
                        )}
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center" style={{ flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                        {categoryData.map((entry, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel card" style={{ minHeight: '400px' }}>
                    <h3 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Recent Transactions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {expenses.slice(0, 5).map((expense) => (
                            <div key={expense.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{expense.description || 'Expense'}</p>
                                        <p className="text-xs text-muted">{expense.date}</p>
                                    </div>
                                </div>
                                <span className="font-bold">
                                    - {user.currency}{expense.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {expenses.length === 0 && <p className="text-center text-light" style={{ padding: '2rem' }}>No recent transactions</p>}
                    </div>

                    <div className="text-center" style={{ marginTop: '1.5rem' }}>
                        <a href="/expenses" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>View All Transactions</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
