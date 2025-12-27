import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout = ({ handleLogout, user }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/' },
        { name: 'Search', href: '/search' },
        { name: 'Manage Tags', href: '/tags' },
        { name: 'Users', href: '/users' },
        { name: 'Groups', href: '/groups' },
        { name: 'Roles', href: '/roles' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 shadow-sm z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                    DocManager
                                </span>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    key = { item.name }
                                        to = { item.href }
                                        className = {`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${location.pathname === item.href
                                        ? 'border-red-500 text-red-900'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                {item.name}
                            </Link>
                                ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="ml-3 relative flex items-center gap-4">
                            <span className="text-sm text-slate-600 font-medium">Hello, {user}</span>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-red-600 transition duration-200 p-2 rounded-full hover:bg-slate-100"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
        </div>

                {/* Mobile Menu */ }
    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white border-b border-slate-200`}>
        <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === item.href
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                        }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>
        <div className="pt-4 pb-4 border-t border-slate-200">
            <div className="flex items-center px-4">
                <div className="ml-3">
                    <div className="text-base font-medium text-slate-800">{user}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-slate-400 hover:text-red-600"
                >
                    <span className="text-sm font-medium mr-1">Logout</span>
                    <svg className="h-6 w-6 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
            </nav >

    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in-up">
            <Outlet />
        </div>
    </main>
        </div >
    );
};

export default Layout;
