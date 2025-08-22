import Rating from '../models/review.model.js'; // ensure file exists
import Media from '../models/media.model.js';

export const vote = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;
    const userId = req.user?.id || req.user?._id;
    const value = Number(req.body.value); // 1 or -1

    if (![1, -1].includes(value)) {
      return res.status(400).json({ message: 'Invalid vote value' });
    }
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // find existing rating
    let existing = await Rating.findOne({ media: mediaId, user: userId });

    if (existing) {
      if (existing.value === value) {
        // same vote again -> remove 
        await existing.remove();
      } else {
        // change vote
        existing.value = value;
        await existing.save();
      }
    } else {
      await Rating.create({ media: mediaId, user: userId, value });
    }

    // recompute totals
    const agg = await Rating.aggregate([
      { $match: { media: new (require('mongoose').Types.ObjectId)(mediaId) } },
      { $group: { _id: '$media', totalVotes: { $sum: 1 }, avg: { $avg: '$value' } } }
    ]);

    const total_votes = agg[0]?.totalVotes || 0;
    
    const average_rating = agg[0]?.avg || 0;

    await Media.findByIdAndUpdate(mediaId, { total_votes, average_rating }, { new: true });

    return res.json({ total_votes, average_rating });
  } catch (err) {
    console.error('Vote error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};