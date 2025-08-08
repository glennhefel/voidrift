import express from 'express';
import Rating from '../models/review.model.js';
//import Media from '../models/media.model.js';
//import User from '../models/user.model.js'; 
const router = express.Router();


router.get('/media/:mediaId', async (req, res) => {
  try {
    const ratings = await Rating.find({ media: req.params.mediaId })
      .populate('user', 'username')  
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get ratings' });
  }
});


router.post('/:mediaId', async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;

    const existing = await Rating.findOne({
      media: req.params.mediaId,
      user: userId
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();
      return res.json({ updated: true, rating: existing });
    }

    const newRating = new Rating({
      media: req.params.mediaId,
      user: userId,
      rating,
      comment
    });

    await newRating.save();
    res.status(201).json({ created: true, rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post rating' });
  }
});

export default router;