import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MediaDetail.css';

function MediaDetail() {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userReviewed, setUserReviewed] = useState(false);
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  useEffect(() => {
    fetch(`http://localhost:5000/media/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setMedia(data);
        setReviews(data.reviews || []);
        setUserReviewed(data.userReviewed);
      })
      .catch(() => setMedia(null));
  }, [id]);

const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this media?')) {
    try {
      const res = await fetch(`http://localhost:5000/media/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Network response was not ok');
      alert('Media deleted!');
      window.location.href = '/home';
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media: ' + err.message);
    }
  }
};

  if (media === null) return <div>Media not found.</div>;

  return (
    <div className="media-detail-container">
      <div className="movie-container">
        <div className="movie-poster">
          <img src={media.poster} alt={`${media.title} Poster`} className="poster-image" />
        </div>

        <div className="movie-details">
          <h1 className="movie-title">{media.title}</h1>
          <div className="movie-meta">
            <span className="release-year btn-sm mb-7 px-7 py-8 rounded">{new Date(media.release_date).getFullYear()}</span>
            <span className="rating">★ {media.average_rating?.toFixed(1) || 'N/A'}/10 - reviews: {media.total_votes}</span>
          </div>
           <div className="movie-info mt-3">
            <p style={{ fontSize: '0.95rem' }}><strong>Director:</strong> {media.director}</p>
            <p style={{ fontSize: '0.95rem' }}><strong>Genre:</strong> {media.genre}</p>
            
          </div>

        <button onClick={handleDelete} className="btn btn-danger btn-sm mb-3 px-3 py-2 rounded">
          Delete Media
        </button>
      
          {userReviewed ? (
            <button className="btn btn-secondary">Bruh</button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-outline-primary btn-sm mb-3 px-3 py-2 rounded"
            >
              Add a review...
            </button>
          )}
          
          <div className="movie-description">
            <h4>Synopsis</h4>
            <br />
            <p style={{ fontSize: '0.95rem' }}>{media.description}</p>
          </div>

         
        </div>
      </div>

      <div className="mt-5 text-light">
        <h4>User Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border rounded p-3 my-3 shadow-sm bg-dark text-light">
              <strong>{review.user.username}</strong> rated it{' '}
              <span className="badge bg-warning text-dark">{review.rating}/10★</span>
              <p className="mt-2">
                {review.comment === '(This guy wrote nothing)' ? (
                  <i style={{ color: 'grey' }}>{review.comment}</i>
                ) : (
                  review.comment
                )}
              </p>
              <div className="d-flex gap-3 align-items-center mt-2">
                <button className="btn btn-sm btn-outline-success">👍 {review.upvotes}</button>
                <button className="btn btn-sm btn-outline-danger">👎 {review.downvotes}</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="review-modal">
          <div className="modal-content-box">
            <h3 className="display-6 mb-4 text-center">Write a review</h3>
            <form onSubmit={async (e) => {
  e.preventDefault();
  const rating = e.target.rating.value;
  const comment = e.target.comment.value;


  await fetch(`http://localhost:5000/ratings/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment, userId }),
  });

  setShowModal(false);

  // refetch media details 
  fetch(`http://localhost:5000/media/${id}`)
    .then(res => res.json())
    .then(data => {
      setMedia(data);
      setReviews(data.reviews || []);
    });
}}>
  <label htmlFor="rating">Rating (1–10):</label>
  <input
    name="rating"
    type="number"
    min="1"
    max="10"
    required
    className="form-control mb-3"
    style={{ width: '80px' }}
  />

  <label htmlFor="comment">Comment:</label>
  <textarea
    name="comment"
    rows="4"
    className="form-control mb-3"
  ></textarea>

  <div className="text-center mt-3">
    <button type="submit" className="btn btn-success btn-sm">Submit</button>
    <button
      type="button"
      onClick={() => setShowModal(false)}
      className="btn btn-outline-secondary btn-sm ms-2"
    >
      Cancel
    </button>
  </div>
</form>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default MediaDetail;