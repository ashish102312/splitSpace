import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Tag, 
  FileText, 
  X,
  AlertCircle,
  Receipt,
  ChevronDown,
  ArrowUpDown,
  Wallet,
  Download
} from 'lucide-react';
import { 
  getPersonalExpenses, 
  createPersonalExpense, 
  updatePersonalExpense, 
  deletePersonalExpense 
} from '../api/personalExpenses';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Shopping',
  'Housing & Rent',
  'Transportation',
  'Entertainment',
  'Health & Fitness',
  'Utilities & Bills',
  'Travel',
  'Education',
  'Other'
];

const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Net Banking',
  'Other'
];

const CATEGORY_TAG_STYLES = {
  'Food & Dining': 'bg-amber-50 text-amber-700 border-amber-200/80',
  'Groceries': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  'Shopping': 'bg-pink-50 text-pink-700 border-pink-200/80',
  'Housing & Rent': 'bg-blue-50 text-blue-700 border-blue-200/80',
  'Transportation': 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  'Entertainment': 'bg-purple-50 text-purple-700 border-purple-200/80',
  'Health & Fitness': 'bg-rose-50 text-rose-700 border-rose-200/80',
  'Utilities & Bills': 'bg-teal-50 text-teal-700 border-teal-200/80',
  'Travel': 'bg-orange-50 text-orange-700 border-orange-200/80',
  'Education': 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  'Other': 'bg-slate-100 text-slate-700 border-slate-200/80'
};

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    payment_method: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPersonalExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch personal expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: 'Food & Dining',
      payment_method: 'UPI',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      payment_method: exp.payment_method || 'UPI',
      date: exp.date.split('T')[0],
      notes: exp.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        payment_method: formData.payment_method,
        date: formData.date,
        notes: formData.notes
      };

      if (editingExpense) {
        await updatePersonalExpense(editingExpense.id, payload);
      } else {
        await createPersonalExpense(payload);
      }
      setShowModal(false);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      await deletePersonalExpense(id);
      fetchExpenses();
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  // Filter & Sort Logic
  const filtered = expenses.filter(exp => {
    const matchesSearch = exp.title?.toLowerCase().includes(search.toLowerCase()) ||
                          exp.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? exp.category === selectedCategory : true;
    const matchesMethod = selectedPaymentMethod ? exp.payment_method === selectedPaymentMethod : true;
    return matchesSearch && matchesCategory && matchesMethod;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  const totalFilteredAmount = sorted.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200/80 p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Split<span className="text-blue-600">Space</span>
            </span>
          </div>
          <button onClick={handleOpenAdd} className="p-2 text-blue-600">
            <Plus className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header & Stats Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Personal Expenses
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Accurate individual ledger tracking with categories, payment tags, and date filters.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Expense</span>
                </button>
              </div>
            </div>

            {/* Summary Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtered Sum</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalFilteredAmount.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Transactions</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{sorted.length} Entries</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Category</p>
                  <p className="text-lg font-bold text-slate-900 mt-1 truncate">{selectedCategory || 'All Categories'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Interactive Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                
                {/* Search */}
                <div className="relative md:col-span-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or note..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="">All Payment Modes</option>
                    {PAYMENT_METHODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Option */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="amount_desc">Highest Amount</option>
                    <option value="amount_asc">Lowest Amount</option>
                  </select>
                </div>

              </div>

              {(search || selectedCategory || selectedPaymentMethod) && (
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <span>Filtered view active.</span>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('');
                      setSelectedPaymentMethod('');
                    }}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* Expenses List / Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-xs text-slate-400">Loading ledger...</div>
              ) : sorted.length === 0 ? (
                <div className="text-center py-16 p-8">
                  <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No matching expenses</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    {expenses.length === 0 
                      ? 'Start logging your daily expenses with category categorization.' 
                      : 'No expenses meet the current filter criteria.'}
                  </p>
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Record Expense
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sorted.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100/70 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {exp.category ? exp.category.charAt(0) : 'E'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{exp.title}</h4>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                              CATEGORY_TAG_STYLES[exp.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {exp.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(exp.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="font-medium text-slate-600">{exp.payment_method || 'UPI'}</span>
                            {exp.notes && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400 truncate max-w-xs">{exp.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pl-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-base font-extrabold text-slate-900">
                            ₹{Number(exp.amount).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(exp)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Add / Edit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingExpense ? 'Edit Expense Record' : 'Log Personal Expense'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Expense Description / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Organic Grocery Market"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {PAYMENT_METHODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Additional context, receipt ID, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingExpense ? 'Save Changes' : 'Confirm Entry'}
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
