import mongoose from 'mongoose';
import Review from '../models/review.model.js';
import ReviewVote from '../models/reviewVote.model.js';

export const voteOnReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user?.id || req.user?._id;
    const value = Number(req.body.value); // 1 or -1

    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).json({ message: 'Invalid review id' });
    if (![1, -1].includes(value)) return res.status(400).json({ message: 'Invalid vote value' });
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const existing = await ReviewVote.findOne({ review: reviewId, user: userId });

    if (existing) {
      if (existing.value === value) {
        await ReviewVote.deleteOne({ _id: existing._id });
      } else {
        existing.value = value;
        await existing.save();
      }
    } else {
      await ReviewVote.create({ review: reviewId, user: userId, value });
    }

    const agg = await ReviewVote.aggregate([
      { $match: { review: new mongoose.Types.ObjectId(reviewId) } },
      {
        $group: {
          _id: '$review',
          upvotes: { $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] } },
          downvotes: { $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] } },
          score: { $sum: '$value' },
          total: { $sum: 1 }
        }
      }
    ]);

    const upvotes = agg[0]?.upvotes || 0;
    const downvotes = agg[0]?.downvotes || 0;
    const score = agg[0]?.score || 0;
    const total_votes = agg[0]?.total || 0;

    await Review.findByIdAndUpdate(reviewId, { upvotes, downvotes, score, total_votes }, { new: true });

    return res.json({ upvotes, downvotes, score, total_votes });
  } catch (err) {
    console.error('voteOnReview error:', err.message || err);
    return res.status(500).json({ message: 'Server error' });
  }
};