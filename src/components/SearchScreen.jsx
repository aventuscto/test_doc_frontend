import React, { useState, useEffect } from 'react';
import api from '../api';

const SearchScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [filename, setFilename] = useState('');
    const [tag, setTag] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const params = {};
            if (filename) params.filename = filename;
            if (tag) params.tag = tag;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await api.get('/documents/', { params });
            setDocuments(response.data);
        } catch (error) {
            console.error("Error searching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Search Documents</h2>

            <form onSubmit={handleSearch} className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Filename</label>
                    <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Search by filename"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tag Value/Name</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="Search by tag (e.g. HR, admin)"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setFilename('');
                            setTag('');
                            setStartDate('');
                            setEndDate('');
                            // Optional: trigger search immediately on reset or let user click search
                        }}
                        className="btn-secondary"
                    >
                        Reset Filters
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Searching...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                                Search
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="table-header">Title</th>
                            <th className="table-header">Meta Tags</th>
                            <th className="table-header">Filename</th>
                            <th className="table-header">Uploaded At</th>
                            <th className="table-header text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {documents.length > 0 ? documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="table-cell font-medium text-slate-900">{doc.title}</td>
                                <td className="table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {doc.tags && doc.tags.length > 0 ? (
                                            doc.tags.map(tag => (
                                                <span key={tag.tag_definition?.id || Math.random()} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    {tag.tag_definition?.label}: <span className="font-bold ml-1">{tag.value}</span>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">No tags</span>
                                        )}
                                    </div>
                                </td>
                                <td className="table-cell text-slate-500 font-mono text-xs">{doc.filename}</td>
                                <td className="table-cell text-slate-500">{new Date(doc.uploaded_at).toLocaleString()}</td>
                                <td className="table-cell text-right">
                                    <a
                                        href={`http://127.0.0.1:8000/uploads/${doc.filename}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-600 hover:text-red-900 font-medium hover:underline"
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    <p className="font-medium">No documents found matching criteria.</p>
                                    <p className="text-sm mt-1">Try adjusting your filters.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchScreen;
