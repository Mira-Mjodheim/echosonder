```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contents');
        setContents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

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
          <li key={content._id}>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentList;
```