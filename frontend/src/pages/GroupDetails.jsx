import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupDetails } from '../api/groups';
import { getGroupExpenses, addExpense } from '../api/expenses';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, PieChart, CreditCard, User, ChevronLeft } from 'lucide-react';

const GroupDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const groupData = await getGroupDetails(id);
      setGroup(groupData);
      
      const expData = await getGroupExpenses(id);
      setExpenses(expData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const total = parseFloat(amount);
    if (isNaN(total) || total <= 0) return alert('Invalid amount');
    
    const numMembers = group.members.length;
    const splitAmount = +(total / numMembers).toFixed(2);
    
    const splits = group.members.map((m, index) => {
      let amt = splitAmount;
      if (index === numMembers - 1) {
        amt = +(total - splitAmount * (numMembers - 1)).toFixed(2);
      }
      return {
        user_id: m.user_id,
        amount: amt,
        paid: m.user_id === user.id
      };
    });

    try {
      await addExpense(id, desc, total, user.id, splits);
      setShowAddExpense(false);
      setDesc('');
      setAmount('');
      fetchData();
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="text-2xl font-bold text-blue-600 tracking-tight">SplitSpace</div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/groups" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <Users className="w-5 h-5" /> Groups
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium cursor-not-allowed opacity-70" title="Coming soon">
            <CreditCard className="w-5 h-5" /> Expenses
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium cursor-not-allowed opacity-70" title="Coming soon">
            <PieChart className="w-5 h-5" /> Analytics
          </div>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium">
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium w-full transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <div className="text-xl font-bold text-blue-600">SplitSpace</div>
          <button onClick={logout} className="text-gray-500 hover:text-red-600 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            
            <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
              <Link to="/groups" className="flex items-center hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Groups
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : !group ? (
              <div className="p-12 text-center text-red-500">Group not found</div>
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                    {group.description && <p className="text-gray-500 mb-4">{group.description}</p>}
                    <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono">
                      Code: <span className="font-bold ml-2 text-gray-900 tracking-wider">{group.code}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddExpense(!showAddExpense)}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                  >
                    {showAddExpense ? 'Cancel' : '+ Add Expense'}
                  </button>
                </div>

                {showAddExpense && (
                  <form onSubmit={handleAddExpense} className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Add an Expense</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input 
                          type="text" required value={desc} onChange={e => setDesc(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Dinner, Taxi, Groceries"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
                        <input 
                          type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      This expense will be split equally among all {group.members.length} members.
                    </p>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Save Expense</button>
                  </form>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
                    {expenses.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No expenses added yet.</p>
                      </div>
                    ) : (
                      expenses.slice().reverse().map(exp => (
                        <div key={exp.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center hover:border-blue-200 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl border border-blue-100">
                              {exp.description.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{exp.description}</h3>
                              <p className="text-sm font-medium text-gray-500">
                                Paid by {exp.paid_by === user.id ? 'You' : exp.paid_by.substring(0,8)+'...'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-xl">${exp.total_amount.toFixed(2)}</p>
                            <p className="text-sm font-medium text-gray-400">
                              {new Date(exp.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Members ({group.members.length})</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      {group.members.map(m => (
                        <div key={m.user_id} className="p-4 border-b border-gray-100 last:border-0 flex items-center space-x-3 hover:bg-gray-50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${m.user_id === user.id ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {m.user_id === user.id ? 'Y' : 'M'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {m.user_id === user.id ? 'You' : m.user_id.substring(0,8)+'...'}
                            </p>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{m.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupDetails;
