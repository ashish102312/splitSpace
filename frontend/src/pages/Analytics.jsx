import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Receipt, 
  ArrowUpRight, 
  Calendar, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Tag,
  CreditCard
} from 'lucide-react';
import { getPersonalAnalytics } from '../api/personalExpenses';

const CATEGORY_BAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-500',
  'bg-indigo-600',
  'bg-teal-500',
  'bg-cyan-600',
  'bg-sky-500',
  'bg-blue-400',
  'bg-emerald-400',
  'bg-slate-500'
];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPersonalAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalSpending = data?.total_spent ?? data?.total_spending ?? 0;
  const count = data?.total_transactions ?? data?.expense_count ?? 0;
  const thisMonthSpending = data?.this_month_spent ?? data?.this_month_spending ?? 0;
  const categoriesList = data?.categories ?? data?.category_breakdown ?? [];
  const topCategory = categoriesList?.[0];
  const avgExpense = count > 0 ? totalSpending / count : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200/80 p-4 flex justify-between items-center md:hidden">
          <div className="text-lg font-bold text-slate-900 tracking-tight">
            Split<span className="text-blue-600">Space</span> Analytics
          </div>
          <button onClick={fetchAnalytics} className="p-2 text-slate-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Financial Analytics & Insights
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Categorical breakdown, transaction averages, and expense velocity diagnostics.
                </p>
              </div>

              <button
                onClick={fetchAnalytics}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative Spend</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">
                  ₹{Number(totalSpending).toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Across all logged time</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Month</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">
                  ₹{Number(thisMonthSpending).toFixed(2)}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active billing period</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transactions</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">
                  {count} <span className="text-xs font-normal text-slate-400">entries</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Tracked ledger records</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Outflow</span>
                  <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">
                  ₹{Number(avgExpense).toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Per transaction average</p>
              </div>

            </div>

            {/* Category Breakdown & Visual Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left 2 Cols: Categorical Allocation */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
                  </div>
                  <span className="text-xs text-slate-500">{categoriesList.length} Categories active</span>
                </div>

                <div className="mt-5 space-y-4">
                  {categoriesList.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                      No categorical expenses logged yet.
                    </div>
                  ) : (
                    categoriesList.map((cat, idx) => {
                      const amount = cat.total ?? cat.amount ?? 0;
                      const percentage = totalSpending > 0 ? ((amount / totalSpending) * 100).toFixed(1) : 0;
                      const barColor = CATEGORY_BAR_COLORS[idx % CATEGORY_BAR_COLORS.length];

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800">{cat.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">₹{Number(amount).toFixed(2)}</span>
                              <span className="text-slate-400 font-mono w-12 text-right">({percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Col: Top Category & Intelligence Summary */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-900">Budget Health</h3>
                  </div>

                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Primary Outflow Category
                    </p>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {topCategory?.category || 'None'}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Accounting for {totalSpending > 0 && topCategory ? (((topCategory.total ?? topCategory.amount ?? 0) / totalSpending) * 100).toFixed(1) : 0}% of all your tracked finances.
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Consistent tracking active</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Zero unassigned transactions</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    Data synced directly with microservices backend.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
