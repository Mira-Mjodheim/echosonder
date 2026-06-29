import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentEditor from '../components/ContentEditor';
import ContentList from '../components/ContentList';
import UserProfile from '../components/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    axios.get('/api/users/me')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get('/api/contents')
      .then(response => {
        setContents(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSelectContent = (content) => {
    setSelectedContent(content);
  };

  const handleCreateContent = (content) => {
    axios.post('/api/contents', content)
      .then(response => {
        setContents([...contents, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdateContent = (content) => {
    axios.put(`/api/contents/${content._id}`, content)
      .then(response => {
        setContents(contents.map(c => c._id === response.data._id ? response.data : c));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteContent = (contentId) => {
    axios.delete(`/api/contents/${contentId}`)
      .then(() => {
        setContents(contents.filter(c => c._id !== contentId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      {user && (
        <UserProfile user={user} />
      )}
      <ContentList
        contents={contents}
        onSelectContent={handleSelectContent}
      />
      {selectedContent && (
        <ContentEditor
          content={selectedContent}
          onCreateContent={handleCreateContent}
          onUpdateContent={handleUpdateContent}
          onDeleteContent={handleDeleteContent}
        />
      )}
    </div>
  );
}

export default App;