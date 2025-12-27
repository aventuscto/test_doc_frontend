import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import Login from './components/Login';
import MetaTagManager from './components/MetaTagManager';
import SearchScreen from './components/SearchScreen';
import RoleList from './components/RoleList';
import UserList from './components/UserList';
import GroupList from './components/GroupList';
import Layout from './components/Layout';

function Dashboard({ handleUploadSuccess, refresh }) {
  return (
    <div className="space-y-6">
      <UploadForm onUploadSuccess={handleUploadSuccess} />
      <DocumentList refreshTrigger={refresh} />
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername || 'User');
    localStorage.setItem('username', newUsername || 'User');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
  };

  const handleUploadSuccess = () => {
    setRefresh(!refresh);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout handleLogout={handleLogout} user={username} />}>
        <Route index element={
          <Dashboard
            handleUploadSuccess={handleUploadSuccess}
            refresh={refresh}
          />
        } />
        <Route path="search" element={<SearchScreen />} />
        <Route path="tags" element={<MetaTagManager />} />
        <Route path="users" element={<UserList />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="roles" element={<RoleList />} />
      </Route>
    </Routes>
  );
}

export default App;
