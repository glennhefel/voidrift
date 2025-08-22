import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function SearchResults() {
  const query = new URLSearchParams(useLocation().search).get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/media/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        console.log('Search response data:', data); // <-- add this line
        if (Array.isArray(data)) setResults(data);
        else if (Array.isArray(data.results)) setResults(data.results);
        else if (data && (data._id || data.id)) setResults([data]);
        else setResults([]);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) return <div className="container mt-4">Type a query in the search box.</div>;
  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!results || results.length === 0) return <div className="container mt-4">No results for "{query}".</div>;

  return (
    <div className="container mt-4">
      <h3>Results for "{query}"</h3>
      <div className="row g-3">
        {results.map((item) => (
          <div key={item._id || item.id} className="col-md-4">
            <div className="card bg-dark text-light">
              <img src={item.poster} alt={item.title} style={{ height: 180, objectFit: 'cover' }} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <Link to={`/media/${item._id || item.id}`} className="btn btn-sm btn-outline-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}