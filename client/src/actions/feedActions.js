import { getFeed } from '../utils/api';

export const loadFeed = (page, limit) => async (dispatch) => {
  dispatch({ type: 'FEED_REQUEST' });
  try {
    const data = await getFeed(page, limit);
    dispatch({ type: 'FEED_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FEED_FAILURE', payload: error.response?.data?.message || error.message });
  }
};
