import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Search, Filter, X } from 'lucide-react';

const Expenses = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
        } catch (error) {
            console.error("Error fetching categories", error);
            // Don't set global error yet, try to load expenses
        }

        try {
            const expRes = await api.get('/expenses');
            setExpenses(expRes.data);
        } catch (error) {
            console.error("Error fetching expenses", error);
            setError("Failed to load expenses. Please try refreshing.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openEditModal = (expense) => {
        setEditMode(true);
        setCurrentId(expense.id);

        // Format date properly for input
        let dateStr = expense.date;
        if (Array.isArray(expense.date)) {
            // Handle if date comes as array from Java [yyyy, mm, dd]
            const [year, month, day] = expense.date;
            dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        setFormData({
            amount: expense.amount,
            description: expense.description,
            categoryId: expense.category ? expense.category.id : '',
            date: dateStr
        });
        setShowAddModal(true);
    }

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditMode(false);
        setCurrentId(null);
        setFormData({ amount: '', description: '', categoryId: '', date: new Date().toISOString().split('T')[0] });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: formData.date,
                category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null
            };

            if (editMode && currentId) {
                await api.updateExpense(currentId, payload);
            } else {
                await api.post('/expenses', payload);
            }

            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error("Error saving expense", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`);
                setExpenses(expenses.filter(e => e.id !== id));
            } catch (error) {
                console.error("Error deleting", error);
            }
        }
    }

    if (loading) return <div className="text-center" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Expenses</h1>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
                <button
                    onClick={() => { setEditMode(false); setShowAddModal(true); }}
                    className="btn btn-primary"
                >
                    <Plus size={20} /> Add Expense
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td className="font-medium">{expense.description || 'No description'}</td>
                                    <td>
                                        <span className="badge badge-indigo">
                                            {expense.category ? expense.category.name : 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="text-muted text-sm">{expense.date}</td>
                                    <td className="font-bold">{user.currency} {expense.amount.toFixed(2)}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(expense)}
                                                className="btn-ghost"
                                                style={{ color: 'var(--primary)' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="btn-danger-ghost"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-light" style={{ padding: '2rem' }}>
                                        No expenses found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Expense Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', right: '1rem', top: '1rem', color: '#94a3b8' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>
                            {editMode ? 'Edit Expense' : 'Add New Expense'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="label">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="e.g. Grocery Shopping"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label className="label">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="input"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-between gap-3" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editMode ? 'Update Expense' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
