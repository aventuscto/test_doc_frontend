import React, { useState, useEffect } from 'react';
import api from '../api';

const MetaTagManager = () => {
    const [tags, setTags] = useState([]);
    const [name, setName] = useState('');
    const [label, setLabel] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTags = async () => {
        try {
            const response = await api.get('/meta-tags/');
            setTags(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/meta-tags/', { name, label });
            setName('');
            setLabel('');
            fetchTags();
        } catch (error) {
            setError('Failed to create tag');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Meta Tags Dictionary</h2>
                    <p className="text-sm text-slate-500 mt-1">Define properties that can be attached to documents.</p>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h3 className="font-semibold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-200">Add New Property</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tag Name (System ID)</label>
                        <input
                            type="text"
                            placeholder="e.g. department_id"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Display Label</label>
                        <input
                            type="text"
                            placeholder="e.g. Department"
                            className="input-field"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="btn-primary w-full md:w-auto self-end"
                    >
                        {loading ? 'Adding...' : 'Add Property'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-3 text-sm font-medium">{error}</p>}
            </div>

            <div className="bg-white rounded-lg">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Active Meta Tags</h3>
                <div className="flex flex-wrap gap-3">
                    {tags.length > 0 ? tags.map((tag) => (
                        <div key={tag.id} className="inline-flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2">
                            <span className="text-sm font-bold text-slate-700 mr-2">{tag.label}</span>
                            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">{tag.name}</span>
                        </div>
                    )) : (
                        <p className="text-slate-400 italic text-sm">No tags defined yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetaTagManager;
