import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, PieChart, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Placeholder for future phase */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="text-2xl font-bold text-blue-600 tracking-tight">SplitSpace</div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium cursor-not-allowed opacity-70" title="Coming soon">
            <Users className="w-5 h-5" /> Groups
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium cursor-not-allowed opacity-70" title="Coming soon">
            <CreditCard className="w-5 h-5" /> Expenses
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium cursor-not-allowed opacity-70" title="Coming soon">
            <PieChart className="w-5 h-5" /> Analytics
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium w-full transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <div className="text-xl font-bold text-blue-600">SplitSpace</div>
          <button onClick={logout} className="text-gray-500 hover:text-red-600 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}.</h1>
              <p className="text-gray-500 mt-2 text-lg">Your SplitSpace dashboard is ready.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Phase 1 Complete</h2>
              <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                You have successfully authenticated. Personal expenses and groups will appear here in the next phase of development.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
