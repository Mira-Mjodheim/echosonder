import { followUser as followUserRequest, unfollowUser as unfollowUserRequest } from '../utils/api';

const errorMessage = (error) => error.response?.data?.message || error.message;

export const followUser = (userId) => async (dispatch) => {
  try {
    await followUserRequest(userId);
    dispatch({ type: 'FOLLOW_USER_SUCCESS', payload: userId });
  } catch (error) {
    dispatch({ type: 'FOLLOW_USER_FAILURE', payload: errorMessage(error) });
  }
};

export const unfollowUser = (userId) => async (dispatch) => {
  try {
    await unfollowUserRequest(userId);
    dispatch({ type: 'UNFOLLOW_USER_SUCCESS', payload: userId });
  } catch (error) {
    dispatch({ type: 'FOLLOW_USER_FAILURE', payload: errorMessage(error) });
  }
};
