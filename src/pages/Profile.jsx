import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './navbar';
import './Profile.css';

const BACKEND = 'http://localhost:5000'; // always hit backend directly

function safeDecodeToken(token) {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch { return null; }
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const decoded = safeDecodeToken(token);
  const fallbackUser = decoded ? { _id: decoded.id || decoded._id || decoded.sub, username: decoded.username || decoded.name, email: decoded.email } : null;

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!token) {
        setUser(fallbackUser);
        setUsernameInput(fallbackUser?.username || '');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BACKEND}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`GET ${res.status}`);
        const data = await res.json().catch(() => null);
        const u = (data && (data.user || data)) || fallbackUser || null;
        setUser(u);
        setUsernameInput(u?.username || fallbackUser?.username || '');
      } catch (err) {
        console.error('profile load error', err);
        setUser(fallbackUser);
        setUsernameInput(fallbackUser?.username || '');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const updateUsername = async (e) => {
    e.preventDefault();
    if (!usernameInput) return alert('Enter a username');
    if (!token) return alert('Please log in');
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND}/api/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: usernameInput }),
      });
      const text = await res.text().catch(() => '');
      console.log('PATCH /api/users/me ->', res.status, text);
      if (!res.ok) return alert(`Update failed: ${res.status} - ${text || 'no body'}`);
      const body = text ? JSON.parse(text) : {};
      const updated = body?.user || body || {};
      setUser(prev => ({ ...(prev || {}), username: updated.username || usernameInput }));
      setUsernameInput('');
      alert('Username updated');
    } catch (err) {
      console.error('username update error', err);
      alert('Username update failed: ' + (err.message || err));
    } finally { setSaving(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert('Enter a new password');
    if (!token) return alert('Please log in');
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND}/api/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword }),
      });
      const text = await res.text().catch(() => '');
      console.log('PATCH /api/users/me (password) ->', res.status, text);
      if (!res.ok) return alert(`Password change failed: ${res.status} - ${text || 'no body'}`);
      setNewPassword('');
      alert('Password updated');
    } catch (err) {
      console.error('password update error', err);
      alert('Password update failed: ' + (err.message || err));
    } finally { setSaving(false); }
  };

  const displayed = user || fallbackUser;

  if (loading) return (
    <>
      <NavBar />
      <div className="profile-page container py-4">Loading...</div>
    </>
  );

  if (!displayed) return (
    <>
      <NavBar />
      <div className="profile-page container py-4">
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
      </div>
    </>
  );

  return (
    <>
      <div className="homepage-dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <div className="profile-page container py-4" style={{ flex: 1 }}>
          <div className="profile-container">
             <div className="profile-header d-flex align-items-center gap-3 mb-3">
               <img src={displayed?.avatar || '/logo192.png'} alt="avatar" className="profile-avatar" />
               <div>
                 <h3 className="mb-0">{displayed?.username || 'Unknown'}</h3>
                 <div className="text-muted">{displayed?.email || ''}</div>
               </div>
             </div>
 
             <div className="mb-4">
               <form onSubmit={updateUsername} className="d-flex gap-2 align-items-center profile-form">
                 <input
                   className="form-control form-control-sm profile-input"
                   value={usernameInput}
                   onChange={e => setUsernameInput(e.target.value)}
                   disabled={saving}
                   placeholder="New username"
                 />
                 <button className="btn btn-sm btn-primary" disabled={saving}>Save</button>
               </form>
             </div>
 
             <div className="mb-4">
               <form onSubmit={updatePassword} className="d-flex gap-2 align-items-center profile-form">
                 <input
                   type="password"
                   className="form-control form-control-sm profile-input"
                   value={newPassword}
                   onChange={e => setNewPassword(e.target.value)}
                   disabled={saving}
                   placeholder="New password"
                 />
                 <button className="btn btn-sm btn-warning" disabled={saving}>Change password</button>
               </form>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}