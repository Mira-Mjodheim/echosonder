import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../client/src/reducers';
import Feed from '../../client/src/components/Feed';
import { getFeed } from '../../client/src/utils/api';

jest.mock('../../client/src/utils/api', () => ({
  getFeed: jest.fn(),
}));

const PAGE_SIZE = 20;

const makeContent = (id, title) => ({
  _id: id,
  title,
  description: `Description de ${title}`,
  mood: 'calme',
  type: 'audio',
  userId: { _id: 'author-id', name: 'Bob' },
});

const renderFeed = () => {
  const store = configureStore({ reducer: rootReducer });
  const utils = render(
    <Provider store={store}>
      <Feed />
    </Provider>
  );
  return { ...utils, store };
};

describe('Feed component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('charge la premiere page au montage et affiche les echos', async () => {
    getFeed.mockResolvedValue({ contents: [makeContent('1', 'Echo 1')], page: 1, limit: PAGE_SIZE, total: 1, hasMore: false });

    const { findByText, getByText } = renderFeed();

    await findByText('Echo 1');
    expect(getFeed).toHaveBeenCalledTimes(1);
    expect(getFeed).toHaveBeenCalledWith(1, PAGE_SIZE);
    expect(getByText('Description de Echo 1')).toBeInTheDocument();
    expect(getByText('par Bob')).toBeInTheDocument();
  });

  it('affiche un message quand le fil est vide', async () => {
    getFeed.mockResolvedValue({ contents: [], page: 1, limit: PAGE_SIZE, total: 0, hasMore: false });

    const { findByText } = renderFeed();

    await findByText('Aucun écho pour le moment.');
  });

  it('charge la page suivante au clic sur Charger plus', async () => {
    getFeed.mockResolvedValueOnce({
      contents: [makeContent('1', 'Echo 1'), makeContent('2', 'Echo 2')],
      page: 1, limit: PAGE_SIZE, total: 3, hasMore: true,
    });
    getFeed.mockResolvedValueOnce({
      contents: [makeContent('3', 'Echo 3')],
      page: 2, limit: PAGE_SIZE, total: 3, hasMore: false,
    });

    const { findByText, getByText, queryByText, getByRole } = renderFeed();

    await findByText('Echo 2');
    fireEvent.click(getByRole('button', { name: 'Charger plus' }));

    await findByText('Echo 3');
    expect(getFeed).toHaveBeenNthCalledWith(2, 2, PAGE_SIZE);
    expect(getByText('Echo 1')).toBeInTheDocument();
    expect(getByText('Echo 2')).toBeInTheDocument();
    expect(getByText('Echo 3')).toBeInTheDocument();
    await waitFor(() => expect(queryByText('Charger plus')).not.toBeInTheDocument());
  });

  it('affiche l\'erreur si le chargement echoue', async () => {
    getFeed.mockRejectedValue(new Error('Réseau indisponible'));

    const { findByText } = renderFeed();

    await findByText('Erreur : Réseau indisponible');
  });
});
