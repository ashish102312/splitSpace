import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  RefreshCw, 
  Award, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { getPersonalAnalytics } from '../api/personalExpenses';

const CATEGORY_COLORS = {
  'Food & Dining': 'bg-amber-500',
  'Groceries': 'bg-emerald-500',
  'Shopping': 'bg-pink-500',
  'Housing & Rent': 'bg-indigo-500',
  'Transportation': 'bg-blue-500',
  'Entertainment': 'bg-purple-500',
  'Health & Fitness': 'bg-rose-500',
  'Utilities & Bills': 'bg-cyan-500',
  'Travel': 'bg-orange-500',
  'Education': 'bg-teal-500',
  'Other': 'bg-gray-400'
};

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
      setError('Failed to fetch analytics summary.');
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SplitSpace
          </div>
          <button 
            onClick={fetchAnalytics}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Spending Analytics</h1>
                <p className="text-gray-500 mt-1">Deep visual breakdown of your financial habits and cash outflow.</p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm shadow-xs transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center shadow-xs">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
                <div className="text-gray-500">Calculating analytics and breakdown...</div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-red-600 flex items-center justify-center gap-2 shadow-xs">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : count === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center shadow-xs">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No spending data yet</h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm mt-2 mb-6">
                  Add expenses in the Personal Expenses tab to unlock category distributions, monthly velocity, and smart insights.
                </p>
                <a
                  href="/expenses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition-colors"
                >
                  Go to Personal Expenses
                </a>
              </div>
            ) : (
              <>
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Outflow</span>
                    <div className="text-2xl font-black text-gray-900 mt-2">
                      ₹{totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span>Across {count} transactions</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">This Month</span>
                    <div className="text-2xl font-black text-blue-600 mt-2">
                      ₹{thisMonthSpending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Current billing cycle</div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Average Expense</span>
                    <div className="text-2xl font-black text-emerald-600 mt-2">
                      ₹{avgExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Per transaction average</div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Top Spend Category</span>
                    <div className="text-lg font-bold text-gray-900 mt-2 truncate">
                      {topCategory?.category || 'None'}
                    </div>
                    <div className="text-xs text-amber-600 mt-1 font-semibold">
                      {topCategory ? `${topCategory.percentage.toFixed(1)}% of all spending` : ''}
                    </div>
                  </div>
                </div>

                {/* Two Column Layout: Categories & Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column: Category Breakdown (2 cols) */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Category Breakdown</h2>
                        <p className="text-xs text-gray-500">Spending grouped by categories with proportion</p>
                      </div>
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {categoriesList.length} Categories
                      </span>
                    </div>

                    <div className="space-y-4">
                      {categoriesList.map((cat) => (
                        <div key={cat.category} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-gray-800 flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat.category] || 'bg-gray-400'}`} />
                              {cat.category}
                              <span className="text-xs text-gray-400">({cat.count} txns)</span>
                            </span>
                            <div className="text-right">
                              <span className="text-gray-900 font-bold">
                                ₹{cat.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="text-xs text-gray-500 ml-2 font-semibold">
                                {cat.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${CATEGORY_COLORS[cat.category] || 'bg-gray-400'}`}
                              style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Payment Modes & Quick Insights */}
                  <div className="space-y-6">

                    {/* Payment Mode Breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">Payment Modes</h2>
                      <p className="text-xs text-gray-500 mb-4">Volume by payment channel</p>

                      <div className="space-y-3">
                        {Object.entries(data.payment_method_breakdown || {}).map(([method, amt]) => {
                          const pct = totalSpending > 0 ? (amt / totalSpending) * 100 : 0;
                          return (
                            <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-2.5">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-800">{method}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">
                                  ₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-gray-400">{pct.toFixed(0)}%</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Financial Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/80 rounded-2xl p-6">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                        <Zap className="w-5 h-5 text-indigo-600" />
                        <span>Smart Financial Insight</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {topCategory ? (
                          <>
                            Your highest expenditure is on <strong className="text-gray-900">{topCategory.category}</strong> representing <strong className="text-gray-900">{topCategory.percentage.toFixed(1)}%</strong> of your total budget. Setting a monthly cap in this category can save you significant funds.
                          </>
                        ) : (
                          'Keep logging daily expenses to generate custom financial tips and smart budgeting suggestions.'
                        )}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Monthly Trends Table */}
                {data.monthly_trends && data.monthly_trends.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Monthly Spending Velocity</h2>
                        <p className="text-xs text-gray-500">Historical trend across recent months</p>
                      </div>
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {data.monthly_trends.map((item) => (
                        <div key={item.month} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
                          <div className="text-xs font-semibold text-gray-500 uppercase">{item.month}</div>
                          <div className="text-xl font-bold text-gray-900 mt-1">
                            ₹{item.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.count} expenses</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
