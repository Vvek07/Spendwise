import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Save } from 'lucide-react';

const Budgets = () => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, budRes] = await Promise.all([
                api.get('/categories'),
                api.get(`/budgets?month=${currentMonth}`)
            ]);
            setCategories(catRes.data);
            setBudgets(budRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetChange = async (categoryId, amount) => {
        try {
            if (!amount) return;

            const payload = {
                category: { id: categoryId },
                limitAmount: parseFloat(amount),
                month: currentMonth
            };

            await api.post('/budgets', payload);
            const budRes = await api.get(`/budgets?month=${currentMonth}`);
            setBudgets(budRes.data);
        } catch (error) {
            console.error("Error setting budget", error);
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header>
                <h1 className="text-3xl font-bold">Budgets</h1>
                <p className="text-muted">Set monthly spending limits for {currentMonth}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => {
                    const currentBudget = budgets.find(b => b.category.id === category.id);
                    const limit = currentBudget ? currentBudget.limitAmount : 0;

                    return (
                        <div key={category.id} className="glass-panel card">
                            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: category.color || '#cbd5e1' }}></div>
                                <h3 className="font-bold text-lg">{category.name}</h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="label">Monthly Limit ({user.currency})</label>
                                <div>
                                    <input
                                        type="number"
                                        defaultValue={limit > 0 ? limit : ''}
                                        className="input"
                                        placeholder="0.00"
                                        onBlur={(e) => handleBudgetChange(category.id, e.target.value)}
                                    />
                                </div>
                                {limit > 0 && (
                                    <p className="text-xs text-success flex items-center gap-1">
                                        <Save size={12} /> Saved
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Budgets;
