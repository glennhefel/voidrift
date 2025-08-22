import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const username = localStorage.getItem('username');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); 
    const q = search.trim();
    if (!q) return;
    // console.log('Search submitted:', q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearch('');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/top100">🏆 Top 100</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/addmedia">➕ Add Media</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/watchlist">👤 Watch List</Link></li>

      </ul>

      <form className="d-flex me-2" onSubmit={handleSearch}>
        <input
          className="form-control form-control-sm me-2"
          type="search"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-success btn-sm" type="submit">Search</button>
      </form>

      <div className="navbar-text me-2 text-light">
        Welcome, <Link className="nav-link d-inline" to="/profile">{username || "Guest"}</Link>
      </div>
      <Link className="btn btn-warning btn-sm" to="/">Logout</Link>
    </nav>
  );
}

export default NavBar;