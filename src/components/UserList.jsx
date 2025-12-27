import React, { useState, useEffect } from 'react';
import { userAPI } from '../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [groupId, setGroupId] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, groupsRes] = await Promise.all([
                userAPI.get('/users/'),
                userAPI.get('/groups/')
            ]);
            setUsers(usersRes.data);
            setGroups(groupsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await userAPI.post('/users/', {
                username,
                password,
                group_id: parseInt(groupId)
            });
            setIsCreating(false);
            setUsername('');
            setPassword('');
            setGroupId('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create user');
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage system users and their group assignments.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {isCreating ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {isCreating && (
                <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in-down">
                    <h3 className="font-semibold text-lg text-slate-800 mb-4 border-b border-slate-200 pb-2">Add New User</h3>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleCreateUser}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Group</label>
                                <select
                                    className="input-field"
                                    value={groupId}
                                    onChange={(e) => setGroupId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a Group...</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="btn-primary">
                                Save User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="table-header">Username</th>
                            <th className="table-header">Group</th>
                            <th className="table-header">Status</th>
                            <th className="table-header text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="table-cell font-medium text-slate-900">{user.username}</td>
                                <td className="table-cell">
                                    {user.group ? (
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-100">
                                            {user.group.name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic">No Group</span>
                                    )}
                                </td>
                                <td className="table-cell">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.is_active
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_active ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="table-cell text-right">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No users found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
