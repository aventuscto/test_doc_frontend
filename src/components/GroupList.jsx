import React, { useState, useEffect } from 'react';
import api from '../api';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [groupsRes, rolesRes] = await Promise.all([
                api.get('/groups/'),
                api.get('/roles/')
            ]);
            setGroups(groupsRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxChange = (roleId) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/groups/', {
                name,
                role_ids: selectedRoles
            });
            setName('');
            setSelectedRoles([]);
            fetchData();
        } catch (error) {
            console.error("Failed to create group", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Group Management</h2>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h3 className="font-semibold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-200">Create New Group</h3>
                <form onSubmit={handleCreateGroup}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
                        <input
                            type="text"
                            placeholder="e.g. HR Department"
                            className="input-field max-w-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Assign Roles</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${selectedRoles.includes(role.id)
                                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => handleCheckboxChange(role.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{role.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-4">Existing Groups</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold text-slate-900">{group.name}</h4>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {group.id}</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Roles:</p>
                            <div className="flex flex-wrap gap-2">
                                {group.roles && group.roles.length > 0 ? (
                                    group.roles.map(r => (
                                        <span key={r.id} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
                                            {r.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic">No roles assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupList;
