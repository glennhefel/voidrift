import { Router } from 'express';
import Media from '../models/media.model.js';
import Rating from '../models/review.model.js';
const router = Router();

// Get all media
router.get('/', async (req, res) => {
  try {
    const mediaList = await Media.find();
    const mediaWithRatings = await Promise.all(
      mediaList.map(async (media) => {
        const ratings = await Rating.find({ media: media._id });
        const total_votes = ratings.length;
        const average_rating = total_votes === 0
          ? 0
          : ratings.reduce((sum, r) => sum + r.rating, 0) / total_votes;
        return {
          ...media.toObject(),
          average_rating,
          total_votes,
        };
      })
    );
    res.json(mediaWithRatings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Not found' });

    const reviews = await Rating.find({ media: media._id }).populate('user');
    const total_votes = reviews.length;
    const average_rating = total_votes === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / total_votes;

    res.json({
      ...media.toObject(),
      reviews,
      average_rating,
      total_votes,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add new media
router.post('/add', async (req, res) => {
  try {
    const newMedia = new Media(req.body);
    await newMedia.save();
    res.json('Media added!');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('DELETE request for:', req.params.id); // Debug log
  try {
    const deleted = await Media.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;