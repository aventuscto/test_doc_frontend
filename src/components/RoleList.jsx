import React, { useState, useEffect } from 'react';
import { userAPI } from '../api';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                userAPI.get('/roles/'),
                userAPI.get('/permissions/')
            ]);
            setRoles(rolesRes.data);
            setPermissions(permsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxChange = (permId) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userAPI.post('/roles/', {
                name,
                permission_ids: selectedPermissions
            });
            setName('');
            setSelectedPermissions([]);
            fetchData();
        } catch (error) {
            console.error("Failed to create role", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Role Management</h2>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h3 className="font-semibold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-200">Create New Role</h3>
                <form onSubmit={handleCreateRole}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Role Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Editor"
                            className="input-field max-w-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Assign Permissions</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {permissions.map((perm) => (
                                <label
                                    key={perm.id}
                                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${selectedPermissions.includes(perm.id)
                                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(perm.id)}
                                        onChange={() => handleCheckboxChange(perm.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{perm.name}</span>
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
                            {loading ? 'Creating...' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-4">Existing Roles</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-bold text-slate-900">{role.name}</h4>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {role.id}</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions && role.permissions.length > 0 ? (
                                    role.permissions.map(p => (
                                        <span key={p.id} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
                                            {p.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic">No permissions assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleList;
