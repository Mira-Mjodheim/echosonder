import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../actions/followActions';

const FollowButton = ({ userId }) => {
  const dispatch = useDispatch();
  const following = useSelector((state) => state.user.currentUser?.following || []);
  const [pending, setPending] = useState(false);
  const isFollowing = following.includes(userId);

  const handleClick = async () => {
    setPending(true);
    await dispatch(isFollowing ? unfollowUser(userId) : followUser(userId));
    setPending(false);
  };

  return (
    <button onClick={handleClick} disabled={pending}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
