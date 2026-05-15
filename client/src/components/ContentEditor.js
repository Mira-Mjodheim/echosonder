```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentEditor = ({ content, setContent, isEditing, setIsEditing }) => {
  const [title, setTitle] = useState(content.title);
  const [text, setText] = useState(content.text);

  useEffect(() => {
    setTitle(content.title);
    setText(content.text);
  }, [content]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.patch(`/api/contents/${content._id}`, {
        title,
        text,
      });
      setContent(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Titre"
          />
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Contenu"
          />
          <button onClick={handleSaveChanges}>Sauvegarder</button>
          <button onClick={handleCancelEditing}>Annuler</button>
        </div>
      ) : (
        <div>
          <h2>{content.title}</h2>
          <p>{content.text}</p>
          <button onClick={() => setIsEditing(true)}>Éditer</button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
```