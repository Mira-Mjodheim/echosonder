import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentList = ({ contents: propContents, onSelectContent }) => {
  const [contents, setContents] = useState(propContents || []);
  const [loading, setLoading] = useState(!propContents);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propContents && propContents.length > 0) {
      setContents(propContents);
      setLoading(false);
      return;
    }

    const fetchContents = async () => {
      try {
        const response = await axios.get('/api/contents');
        setContents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, [propContents]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Content List</h1>
      <ul>
        {contents.map((content) => (
          <li key={content._id} onClick={() => onSelectContent?.(content)} style={{ cursor: 'pointer' }}>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentList;
