import React, { useState, useEffect } from 'react';
import { documentAPI } from '../api';

const UploadForm = ({ onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [metaTags, setMetaTags] = useState([]);
    const [tagValues, setTagValues] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchMetaTags = async () => {
            try {
                const response = await documentAPI.get('/meta-tags/');
                setMetaTags(response.data);
            } catch (error) {
                console.error("Error fetching meta tags:", error);
            }
        };
        fetchMetaTags();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTagChange = (tagId, value) => {
        setTagValues(prev => ({
            ...prev,
            [tagId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('tags', JSON.stringify(tagValues));

        try {
            await documentAPI.post('/documents/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Upload successful!');
            setTitle('');
            setFile(null);
            setTagValues({});
            // Reset file input manually if needed or via ref
            if (onUploadSuccess) onUploadSuccess();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Upload Document</h2>
            {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field"
                        placeholder="Document Title"
                        required
                    />
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">Meta Tags and Properties</h3>
                        <span className="text-xs text-slate-500">Optional</span>
                    </div>

                    <div className="mb-4">
                        <select
                            className="input-field"
                            onChange={(e) => {
                                const tagId = e.target.value;
                                if (tagId) {
                                    handleTagChange(parseInt(tagId), '');
                                    e.target.value = ''; // Reset select
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a property to add...</option>
                            {Array.isArray(metaTags) && metaTags
                                .filter(tag => !tagValues.hasOwnProperty(tag.id))
                                .map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.label}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {Object.keys(tagValues).length === 0 && (
                            <p className="text-center text-sm text-slate-400 italic py-2">No tags added yet</p>
                        )}
                        {Object.keys(tagValues).map((tagId) => {
                            const tag = metaTags.find(t => t.id === parseInt(tagId));
                            if (!tag) return null;
                            return (
                                <div key={tagId} className="flex gap-3 items-center group">
                                    <label className="block text-sm font-medium text-slate-700 w-1/3 truncate text-right" title={tag.label}>
                                        {tag.label}:
                                    </label>
                                    <input
                                        type="text"
                                        value={tagValues[tagId]}
                                        onChange={(e) => handleTagChange(tag.id, e.target.value)}
                                        className="input-field !mt-0 flex-1"
                                        placeholder={`Value for ${tag.name}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newValues = { ...tagValues };
                                            delete newValues[tagId];
                                            setTagValues(newValues);
                                        }}
                                        className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                                        title="Remove tag"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">File Upload</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-slate-50 hover:bg-slate-100">
                        <div className="space-y-1 text-center">
                            {file ? (
                                <div className="text-sm text-slate-600">
                                    <p className="font-semibold text-blue-600">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-xs text-blue-500 hover:underline mt-2"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        PDF, PNG, JPG up to 10MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="btn-primary w-full sm:w-auto"
                    >
                        {isUploading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Uploading...
                            </span>
                        ) : 'Upload Document'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadForm;
