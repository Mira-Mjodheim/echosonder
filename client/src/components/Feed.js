import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFeed } from '../actions/feedActions';
import ContentCard from './ContentCard';

const PAGE_SIZE = 20;

const Feed = () => {
  const dispatch = useDispatch();
  const { items, page, hasMore, loading, error } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(loadFeed(1, PAGE_SIZE));
  }, [dispatch]);

  return (
    <div>
      <h1>Fil d'actualité</h1>
      {error && <p>Erreur : {error}</p>}
      <ul>
        {items.map((content) => (
          <li key={content._id}>
            <ContentCard content={content} />
          </li>
        ))}
      </ul>
      {loading && <p>Chargement...</p>}
      {!loading && page > 0 && items.length === 0 && !error && <p>Aucun écho pour le moment.</p>}
      {!loading && hasMore && page > 0 && (
        <button onClick={() => dispatch(loadFeed(page + 1, PAGE_SIZE))}>Charger plus</button>
      )}
    </div>
  );
};

export default Feed;
