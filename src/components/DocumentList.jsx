import React, { useEffect, useState } from 'react';
import api from '../api';

const DocumentList = ({ refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await api.get('/documents/');
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching documents", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [refreshTrigger]);

    return (
        <div className="card mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Uploaded Documents</h2>

            {loading ? (
                <div className="flex justify-center p-8">
                    <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : (
                <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Title</th>
                                <th className="table-header">Filename</th>
                                <th className="table-header">Meta Tags</th>
                                <th className="table-header">Uploaded At</th>
                                <th className="table-header text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-medium text-slate-900">{doc.title}</td>
                                    <td className="table-cell text-slate-500 font-mono text-xs">{doc.filename}</td>
                                    <td className="table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {doc.tags && doc.tags.length > 0 ? (
                                                doc.tags.map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                        {tag.tag_definition?.name}: <span className="font-bold ml-1">{tag.value}</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">No tags</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-500">
                                        {new Date(doc.uploaded_at).toLocaleString()}
                                    </td>
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
                            ))}
                        </tbody>
                    </table>
                    {documents.length === 0 && (
                        <div className="text-center py-10 text-slate-500 bg-slate-50">
                            No documents found. Upload one to get started.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentList;
