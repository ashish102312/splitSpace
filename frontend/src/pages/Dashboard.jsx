import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  CreditCard, 
  PieChart, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Receipt, 
  ShieldCheck, 
  DollarSign,
  ChevronRight,
  Clock,
  Sparkles
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

  const totalSpent = analytics?.total_spending || 0;
  const thisMonthSpent = analytics?.this_month_spending || 0;
  const topCategory = analytics?.category_breakdown?.[0]?.category || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SplitSpace
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs"
          >
            {user?.name?.[0] || 'U'}
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Personal & Group Expense Hub</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                  Welcome back, {user?.name || 'Friend'}!
                </h1>
                <p className="mt-2 text-blue-100 text-sm md:text-base leading-relaxed">
                  Track individual spending, split group trips and flat bills, and keep complete visibility over your finances.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/expenses"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" /> Personal Expense
                  </Link>
                  <Link
                    to="/groups"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/40 hover:bg-blue-500/60 border border-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur-xs transition-all"
                  >
                    <Users className="w-4 h-4" /> Split with Groups
                  </Link>
                </div>
              </div>

              {/* Decorative background circle */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
            </div>

            {/* 3 Overview Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Personal Outflow</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900 mt-3">
                  ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>This month: <strong className="text-gray-800">₹{thisMonthSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                  <Link to="/expenses" className="text-blue-600 font-semibold hover:underline">Manage</Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Groups</span>
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900 mt-3">
                  {groups.length} <span className="text-base font-normal text-gray-400">groups</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Split expenses with roommates & friends</span>
                  <Link to="/groups" className="text-indigo-600 font-semibold hover:underline">View</Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Analytics & Insights</span>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <PieChart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-3 truncate">
                  {topCategory !== 'N/A' ? topCategory : 'No Data'}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Top category share</span>
                  <Link to="/analytics" className="text-amber-600 font-semibold hover:underline">Full Report</Link>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Recent Personal Expenses & Active Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Column: Recent Personal Expenses */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Recent Personal Expenses</h2>
                      <p className="text-xs text-gray-500">Your latest logged out-of-pocket transactions</p>
                    </div>
                    <Link
                      to="/expenses"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {recentExpenses.length === 0 ? (
                    <div className="py-8 text-center">
                      <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No personal expenses logged yet.</p>
                      <Link
                        to="/expenses"
                        className="inline-block mt-3 text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Log your first expense
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentExpenses.map((exp) => (
                        <div key={exp.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                              <Receipt className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{exp.title}</div>
                              <div className="text-xs text-gray-400">
                                {exp.category} • {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">
                              ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-400">{exp.payment_method}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <Link
                    to="/expenses"
                    className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Manage All Expenses</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Active Groups */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Your Split Groups</h2>
                      <p className="text-xs text-gray-500">Shared group finances and debt balances</p>
                    </div>
                    <Link
                      to="/groups"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {groups.length === 0 ? (
                    <div className="py-8 text-center">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">You are not part of any groups yet.</p>
                      <Link
                        to="/groups"
                        className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        + Create or join a group
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {groups.slice(0, 4).map((group) => (
                        <Link
                          key={group.id}
                          to={`/groups/${group.id}`}
                          className="py-3 flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                              {group.name?.[0]?.toUpperCase() || 'G'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {group.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {group.members?.length || 1} members • Code: <span className="font-mono">{group.code}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <Link
                    to="/groups"
                    className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Explore Group Expenses</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
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
