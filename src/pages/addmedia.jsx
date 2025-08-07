import React, { useState } from 'react';

function AddMediaForm() {
  const [form, setForm] = useState({
    title: '',
    release_date: '',
    media: '',
    genre: '',
    director: '',
    description: '',
    poster: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/media/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add media');
      alert('Media added!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-dark text-light rounded">
      <h3>Add New Media</h3>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="form-control mb-2" />
      <input name="release_date" type="date" value={form.release_date} onChange={handleChange} required className="form-control mb-2" />
      <input name="media" placeholder="Type (Anime/Movie)" value={form.media} onChange={handleChange} required className="form-control mb-2" />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required className="form-control mb-2" />
      <input name="director" placeholder="Director" value={form.director} onChange={handleChange} className="form-control mb-2" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="form-control mb-2" />
      <input name="poster" placeholder="Poster URL" value={form.poster} onChange={handleChange} className="form-control mb-2" />
      <button type="submit" className="btn btn-primary">Add Media</button>
    </form>
  );
}

export default AddMediaForm;