import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ContentEditor from '../components/ContentEditor';
import ContentList from '../components/ContentList';
import Feed from '../components/Feed';
import UserProfile from '../components/UserProfile';
import { getProfile } from '../utils/api';

function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  useEffect(() => {
    getProfile()
      .then(profile => {
        setUser(profile);
        dispatch({ type: 'SET_CURRENT_USER', payload: profile });
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
      <nav>
        <button onClick={() => navigate('/')}>Accueil</button>
        <button onClick={() => navigate('/feed')}>Fil d'actualité</button>
      </nav>
      {path === '/feed' ? (
        <Feed />
      ) : (
        <>
          {user && (
            <UserProfile user={user} />
          )}
          <ContentList
            contents={contents}
            onSelectContent={handleSelectContent}
          />
          {selectedContent?.userId?._id && selectedContent.userId._id !== user?._id && (
            <UserProfile user={selectedContent.userId} />
          )}
          {selectedContent && (
            <ContentEditor
              content={selectedContent}
              onCreateContent={handleCreateContent}
              onUpdateContent={handleUpdateContent}
              onDeleteContent={handleDeleteContent}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;