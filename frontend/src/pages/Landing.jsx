import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">SplitSpace</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Manage your money.<br/>Split expenses.<br/><span className="text-blue-600">Stay organized.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track your personal expenses and manage shared spending with friends, roommates, and groups in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How SplitSpace Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create your account', desc: 'Sign up in seconds and access your personal dashboard.' },
              { step: '2', title: 'Track your expenses', desc: 'Log your daily spending to keep your finances in check.' },
              { step: '3', title: 'Create or join groups', desc: 'Easily organize roommates, trips, or events.' },
              { step: '4', title: 'Manage shared expenses', desc: 'Split bills and see who owes who without the awkwardness.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} SplitSpace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
