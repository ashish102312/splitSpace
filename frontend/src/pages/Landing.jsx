import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">SplitSpace</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Register</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Manage your personal expenses<br className="hidden md:block"/> and shared group expenses<br className="hidden md:block"/> in one place.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          SplitSpace is the easiest way to track your own spending and share costs with friends, family, or roommates without the headache.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Get Started Free
          </Link>
        </div>
        
        <div className="mt-32 grid md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Personal Expenses</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Keep a close eye on your own budget. Track where your money goes, categorize your spending, and stay on top of your financial health.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Group Expenses</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Create groups for trips, apartments, or events. Add expenses, and SplitSpace will automatically calculate who owes what.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} SplitSpace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
