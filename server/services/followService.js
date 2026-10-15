const User = require('../models/User');
const Content = require('../models/Content');

const DEFAULT_FEED_LIMIT = 20;
const MAX_FEED_LIMIT = 50;

const toProfile = (user) => {
  const profile = user.toObject();
  return {
    ...profile,
    followersCount: profile.followers.length,
    followingCount: profile.following.length,
  };
};

const follow = async (followerId, targetId) => {
  const target = await User.findByIdAndUpdate(
    targetId,
    { $addToSet: { followers: followerId } },
    { new: true }
  ).select('-password');
  if (!target) return null;
  await User.updateOne({ _id: followerId }, { $addToSet: { following: targetId } });
  return toProfile(target);
};

const unfollow = async (followerId, targetId) => {
  const target = await User.findByIdAndUpdate(
    targetId,
    { $pull: { followers: followerId } },
    { new: true }
  ).select('-password');
  if (!target) return null;
  await User.updateOne({ _id: followerId }, { $pull: { following: targetId } });
  return toProfile(target);
};

const removeFollowRelations = (userId) =>
  User.updateMany(
    { $or: [{ followers: userId }, { following: userId }] },
    { $pull: { followers: userId, following: userId } }
  );

const getFeed = async (userId, { page, limit }) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_FEED_LIMIT, 1), MAX_FEED_LIMIT);

  const me = await User.findById(userId).select('following');
  if (!me) return null;

  const filter = { userId: { $in: me.following } };
  const [contents, total] = await Promise.all([
    Content.find(filter)
      .populate('userId', '_id name email')
      .sort({ createdAt: -1, _id: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Content.countDocuments(filter),
  ]);

  return {
    contents,
    page: currentPage,
    limit: pageSize,
    total,
    hasMore: currentPage * pageSize < total,
  };
};

module.exports = { follow, unfollow, removeFollowRelations, getFeed };
