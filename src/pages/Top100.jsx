import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function Top100Page() {
  const username = localStorage.getItem('username');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/media')
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then((data) => {
        // Sort by average_rating descending and take top 100
        const sorted = data
          .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
          .slice(0, 100);
        setMedia(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching media:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="homepage-dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/home">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="/top100">🏆 Top 100</Link>
          </li>
        </ul>
        <form className="d-flex me-2">
          <input className="form-control form-control-sm me-2" type="search" placeholder="Search" />
          <button className="btn btn-outline-success btn-sm" type="submit">Search</button>
        </form>
        <div className="navbar-text me-2 text-light">
          Welcome, {username || "Guest"}
        </div>
        <Link className="btn btn-warning btn-sm" to="/">Logout</Link>
      </nav>

      <div className="container mt-4 text-light" style={{ flex: 1 }}>
        <h1 className="display-4 mb-4">Top 100 Rated</h1>
        <hr className="mb-4 border-light" />
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
          {loading ? (
            <p>Loading...</p>
          ) : media.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">No media items found.</div>
            </div>
          ) : (
            media.map((item) => (
              <div className="col" key={item._id}>
                <div className="card h-100 shadow-sm media-card bg-dark text-light">
                  <img
                    src={item.poster}
                    className="card-img-top"
                    style={{ height: '300px', objectFit: 'cover' }}
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center clamp-2-lines">
                      {item.title}
                    </h5>
                    <div className="text-center mt-2">
                      <span className="rating-badge">
                        ★ {item.average_rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="comment-count-badge">
                        Reviews: {item.total_votes || 0}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent text-center border-0">
                    <Link to={`/media/${item._id}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Top100Page;