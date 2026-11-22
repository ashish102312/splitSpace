import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Receipt, 
  ShieldCheck, 
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGroups } from '../api/groups';
import { getPersonalExpenses, getPersonalAnalytics } from '../api/personalExpenses';

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [groupsData, expensesData, analyticsData] = await Promise.allSettled([
          getGroups(),
          getPersonalExpenses({ limit: 5 }),
          getPersonalAnalytics()
        ]);

        if (groupsData.status === 'fulfilled') {
          setGroups(groupsData.value || []);
        }
        if (expensesData.status === 'fulfilled') {
          setRecentExpenses(expensesData.value || []);
        }
        if (analyticsData.status === 'fulfilled') {
          setAnalytics(analyticsData.value || null);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalSpent = analytics?.total_spending ?? analytics?.total_spent ?? 0;
  const thisMonthSpent = analytics?.this_month_spending ?? analytics?.this_month_spent ?? 0;
  const topCategory = analytics?.category_breakdown?.[0]?.category || analytics?.categories?.[0]?.category || 'None';

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
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs"
          >
            {user?.name?.[0] || 'U'}
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Top Interactive Hero Banner (Institutional Blue + Mint accents) */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-sm border border-blue-950/40">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Institutional Expense Management System</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Welcome back, {user?.name || 'Member'}
                </h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Real-time ledger tracking, multi-party bill settlements, and automated debt simplification across all your workspaces.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/expenses"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4" /> Log Personal Expense
                  </Link>
                  <Link
                    to="/groups"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-xs transition-all active:scale-[0.99]"
                  >
                    <Users className="w-4 h-4" /> Open Group Spaces
                  </Link>
                </div>
              </div>

              {/* Decorative Subtle Background Accents */}
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
              <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
            </div>

            {/* 3 Overview Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Total Spending */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Personal Outflow</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                  ₹{Number(totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>This month: <strong className="text-slate-800">₹{Number(thisMonthSpent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                  <Link to="/expenses" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Active Shared Spaces */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Group Spaces</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                  {groups.length} <span className="text-sm font-medium text-slate-600">Spaces</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>Simplified group debts active</span>
                  <Link to="/groups" className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1">
                    View Spaces <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Top Category */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Expenditure</span>
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-3 truncate">
                  {topCategory}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>Detailed breakdown</span>
                  <Link to="/analytics" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                    Analytics <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Two Column Layout: Recent Expenses & Active Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Column: Recent Personal Expenses */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
                  </div>
                  <Link to="/expenses" className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
                    View All
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400">Loading records...</div>
                  ) : recentExpenses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-medium text-slate-500">No personal expenses recorded yet.</p>
                      <Link 
                        to="/expenses" 
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add First Expense
                      </Link>
                    </div>
                  ) : (
                    recentExpenses.slice(0, 5).map((exp) => (
                      <div 
                        key={exp.id} 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {exp.category ? exp.category.charAt(0) : 'E'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{exp.title}</p>
                            <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                              <span>{exp.category || 'General'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>{new Date(exp.date).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 pl-2">
                          <p className="text-sm font-bold text-slate-900">
                            ₹{Number(exp.amount).toFixed(2)}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-600 uppercase">
                            {exp.payment_method || 'Direct'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Active Groups */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900">Group Spaces</h2>
                  </div>
                  <Link to="/groups" className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800">
                    Manage
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400">Loading spaces...</div>
                  ) : groups.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-medium text-slate-500">No active shared groups.</p>
                      <Link 
                        to="/groups" 
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create or Join Group
                      </Link>
                    </div>
                  ) : (
                    groups.slice(0, 5).map((g) => (
                      <Link
                        key={g.id}
                        to={`/groups/${g.id}`}
                        className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                            {g.name ? g.name.charAt(0).toUpperCase() : 'G'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {g.name}
                            </p>
                            <p className="text-xs text-slate-600 truncate mt-0.5">
                              {g.description || 'Shared expense space'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                            {g.code || g.invite_code || 'CODE'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
