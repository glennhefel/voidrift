import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const username = localStorage.getItem('username');
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/top100">🏆 Top 100</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addmedia">➕ Add Media</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">👤 Watch List</Link>
        </li>
      </ul>
      <form className="d-flex me-2">
        <input className="form-control form-control-sm me-2" type="search" placeholder="Search" />
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