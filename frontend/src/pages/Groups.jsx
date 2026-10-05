import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, PieChart, CreditCard, User } from 'lucide-react';
import { getGroups, createGroup, joinGroup } from '../api/groups';

const Groups = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createGroup(createName, createDesc);
      setShowCreate(false);
      setCreateName('');
      setCreateDesc('');
      fetchGroups();
    } catch (err) {
      alert('Failed to create group');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await joinGroup(joinCode);
      setShowJoin(false);
      setJoinCode('');
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to join group. Invalid code?');
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
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                <p className="text-gray-500 mt-1">Manage your shared expenses</p>
              </div>
              <div className="space-x-4">
                <button 
                  onClick={() => { setShowJoin(true); setShowCreate(false); }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                  Join Group
                </button>
                <button 
                  onClick={() => { setShowCreate(true); setShowJoin(false); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  + Create Group
                </button>
              </div>
            </div>

            {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            {showCreate && (
              <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Group</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                    <input 
                      type="text" required value={createName} onChange={e => setCreateName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Hawaii Trip"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <input 
                      type="text" value={createDesc} onChange={e => setCreateDesc(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="What is this group for?"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Create</button>
                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                  </div>
                </div>
              </form>
            )}

            {showJoin && (
              <form onSubmit={handleJoin} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Join a Group</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Code</label>
                    <input 
                      type="text" required value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      placeholder="e.g. A7B9Q2"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Join</button>
                    <button type="button" onClick={() => setShowJoin(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                  </div>
                </div>
              </form>
            )}

            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : groups.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Groups Yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">You aren't in any groups. Create one to start tracking shared expenses with friends.</p>
                <button onClick={() => setShowCreate(true)} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Create Group</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                  <Link to={`/groups/${group.id}`} key={group.id} className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold border border-gray-200">{group.code}</span>
                    </div>
                    {group.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{group.description}</p>}
                    <div className="text-sm font-medium text-gray-600 flex items-center mt-auto">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Groups;
