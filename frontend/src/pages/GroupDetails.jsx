import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupDetails, getGroupBalances } from '../api/groups';
import { getGroupExpenses, addExpense } from '../api/expenses';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  Plus, 
  Users, 
  Receipt, 
  Scale, 
  Copy, 
  Check, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Wallet
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const GroupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balancesData, setBalancesData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'balances'

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const groupData = await getGroupDetails(id);
      setGroup(groupData);
      
      const expData = await getGroupExpenses(id);
      setExpenses(expData || []);

      const balData = await getGroupBalances(id);
      setBalancesData(balData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const total = parseFloat(amount);
    if (isNaN(total) || total <= 0) return alert('Enter a valid amount');
    
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
      alert('Failed to register expense');
    }
  };

  const handleSettle = async (fromUser, toUser, settleAmount) => {
    try {
      const splits = [
        { user_id: fromUser, amount: settleAmount, paid: false },
        { user_id: toUser, amount: settleAmount, paid: true }
      ];
      await addExpense(id, 'Settlement Transfer', settleAmount, fromUser, splits, true);
      fetchData();
    } catch (err) {
      alert('Failed to record settlement');
    }
  };

  const copyInvite = () => {
    const inviteCode = group?.code || group?.invite_code;
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading group space ledger...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-md">
            <p className="text-slate-800 font-bold mb-3">Group space not found.</p>
            <Link to="/groups" className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">
              Back to Groups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberMap = {};
  group.members?.forEach(m => {
    memberMap[m.user_id] = m.name || m.user_id.substring(0, 8);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200/80 p-4 flex justify-between items-center md:hidden">
          <Link to="/groups" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ChevronLeft className="w-4 h-4" />
            <span>Groups</span>
          </Link>
          <span className="font-bold text-slate-900 text-sm truncate max-w-[180px]">{group.name}</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Back link */}
            <Link 
              to="/groups" 
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Group Spaces</span>
            </Link>

            {/* Space Header Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {group.name}
                    </h1>
                    <p className="text-xs text-slate-500">{group.description || 'Shared expense space'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {group.members?.length || 0} Members
                  </span>

                  <button
                    onClick={copyInvite}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-mono bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold font-sans">Invite Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Code: <strong>{group.code || group.invite_code || 'N/A'}</strong></span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Split An Expense</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Light green active pill + corporate blue indicator) */}
            <div className="flex border-b border-slate-200 gap-6">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`pb-3 text-sm font-bold tracking-tight transition-all relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'expenses'
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Expense Ledger ({expenses.length})</span>
                {activeTab === 'expenses' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('balances')}
                className={`pb-3 text-sm font-bold tracking-tight transition-all relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'balances'
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Balances & Settlement</span>
                {activeTab === 'balances' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'expenses' ? (
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
                    <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No expenses recorded yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Add expenses to automatically split them among all {group.members?.length || 0} group members.
                    </p>
                    <button
                      onClick={() => setShowAddExpense(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Add First Expense
                    </button>
                  </div>
                ) : (
                  expenses.slice().reverse().map((exp) => (
                    <div 
                      key={exp.id} 
                      className={`p-4 md:p-5 rounded-2xl transition-all border flex items-center justify-between ${
                        exp.is_settlement 
                          ? 'bg-emerald-50/60 border-emerald-200/80' 
                          : 'bg-white border-slate-200/80 hover:border-blue-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          exp.is_settlement 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {exp.is_settlement ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            exp.description.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate ${
                            exp.is_settlement ? 'text-emerald-950' : 'text-slate-900'
                          }`}>
                            {exp.description}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {exp.is_settlement ? 'Settlement by' : 'Paid by'}{' '}
                            <span className="font-semibold text-slate-700">
                              {exp.paid_by === user.id ? 'You' : (memberMap[exp.paid_by] || exp.paid_by.substring(0, 8))}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-3">
                        <p className={`text-base font-extrabold ${
                          exp.is_settlement ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          ₹{Number(exp.total_amount).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(exp.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* BALANCES TAB */
              <div className="space-y-6">
                
                {/* Net Member Balances */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Individual Member Positions
                    </h3>
                    <span className="text-xs text-slate-400">Total net should balance to zero</span>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {balancesData?.net_balances && Object.entries(balancesData.net_balances).map(([userId, net]) => {
                      const isMe = userId === user.id;
                      const val = Number(net);
                      return (
                        <div key={userId} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                              {(memberMap[userId] || 'U')[0]}
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                              {memberMap[userId] || userId.substring(0, 8)} {isMe && <span className="text-xs text-blue-600 font-bold">(You)</span>}
                            </span>
                          </div>

                          <div className="text-right">
                            {val > 0.01 ? (
                              <span className="text-sm font-bold text-emerald-600">
                                +₹{val.toFixed(2)} (gets back)
                              </span>
                            ) : val < -0.01 ? (
                              <span className="text-sm font-bold text-rose-600">
                                -₹{Math.abs(val).toFixed(2)} (owes)
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-slate-400">
                                Settled (₹0.00)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Suggested Simplified Transactions (Greedy Algorithm) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        Optimized Settlements (Greedy Minimizer)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Minimum number of debt transactions required to fully settle the space.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {!balancesData?.settlements || balancesData.settlements.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-800">All balances are completely settled!</p>
                        <p className="text-xs text-slate-500 mt-0.5">Nobody in this space currently owes anything.</p>
                      </div>
                    ) : (
                      balancesData.settlements.map((s, idx) => {
                        const canSettle = s.from_user === user.id;
                        return (
                          <div 
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm text-slate-800">
                                {memberMap[s.from_user] || s.from_user.substring(0, 8)}
                              </span>
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                                owes ₹{Number(s.amount).toFixed(2)}
                                <ArrowRight className="w-3 h-3 text-emerald-700" />
                              </div>
                              <span className="font-semibold text-sm text-slate-800">
                                {memberMap[s.to_user] || s.to_user.substring(0, 8)}
                              </span>
                            </div>

                            {canSettle && (
                              <button
                                onClick={() => handleSettle(s.from_user, s.to_user, s.amount)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Record Settlement
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Group Expense</h3>
              <button 
                onClick={() => setShowAddExpense(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Airbnb stay, Dinner & drinks"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
                Split equally among all <strong className="text-slate-800">{group.members?.length || 0} members</strong>. You are marked as the payer.
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GroupDetails;
