import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../client/src/reducers';
import FollowButton from '../../client/src/components/FollowButton';
import { followUser, unfollowUser } from '../../client/src/utils/api';

jest.mock('../../client/src/utils/api', () => ({
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
}));

const TARGET_ID = 'target-user-id';

const renderFollowButton = ({ following = [] } = {}) => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'SET_CURRENT_USER',
    payload: { _id: 'me-id', name: 'Me', following },
  });
  const utils = render(
    <Provider store={store}>
      <FollowButton userId={TARGET_ID} />
    </Provider>
  );
  return { ...utils, store };
};

describe('FollowButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche Follow quand l\'utilisateur ne suit pas la cible', () => {
    const { getByRole } = renderFollowButton();
    expect(getByRole('button')).toHaveTextContent('Follow');
  });

  it('affiche Unfollow quand l\'utilisateur suit deja la cible', () => {
    const { getByRole } = renderFollowButton({ following: [TARGET_ID] });
    expect(getByRole('button')).toHaveTextContent('Unfollow');
  });

  it('appelle l\'API follow au clic et met a jour le state Redux', async () => {
    followUser.mockResolvedValue({ _id: TARGET_ID, followersCount: 1 });
    const { getByRole, store } = renderFollowButton();

    fireEvent.click(getByRole('button'));

    await waitFor(() => expect(getByRole('button')).toHaveTextContent('Unfollow'));
    expect(followUser).toHaveBeenCalledWith(TARGET_ID);
    expect(store.getState().user.currentUser.following).toEqual([TARGET_ID]);
  });

  it('appelle l\'API unfollow au clic et met a jour le state Redux', async () => {
    unfollowUser.mockResolvedValue({ _id: TARGET_ID, followersCount: 0 });
    const { getByRole, store } = renderFollowButton({ following: [TARGET_ID] });

    fireEvent.click(getByRole('button'));

    await waitFor(() => expect(getByRole('button')).toHaveTextContent('Follow'));
    expect(unfollowUser).toHaveBeenCalledWith(TARGET_ID);
    expect(store.getState().user.currentUser.following).toEqual([]);
  });

  it('reste sur Follow et enregistre l\'erreur si l\'API echoue', async () => {
    followUser.mockRejectedValue({ response: { data: { message: 'Erreur serveur' } } });
    const { getByRole, store } = renderFollowButton();

    fireEvent.click(getByRole('button'));

    await waitFor(() => expect(store.getState().user.error).toBe('Erreur serveur'));
    expect(getByRole('button')).toHaveTextContent('Follow');
    expect(store.getState().user.currentUser.following).toEqual([]);
  });
});
