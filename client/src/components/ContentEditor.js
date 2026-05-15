import React, { useState, useEffect } from 'react';

const MOODS = ['joie', 'mélancolie', 'calme', 'énergie', 'nostalgie', 'mystère', 'autre'];
const TYPES = ['audio', 'ambient', 'vocal', 'instrumental'];

const ContentEditor = ({ content, onUpdateContent, onDeleteContent }) => {
  const [title, setTitle]           = useState(content.title || '');
  const [description, setDescription] = useState(content.description || '');
  const [audioUrl, setAudioUrl]     = useState(content.audioUrl || '');
  const [mood, setMood]             = useState(content.mood || 'autre');
  const [type, setType]             = useState(content.type || 'audio');
  const [isEditing, setIsEditing]   = useState(false);

  useEffect(() => {
    setTitle(content.title || '');
    setDescription(content.description || '');
    setAudioUrl(content.audioUrl || '');
    setMood(content.mood || 'autre');
    setType(content.type || 'audio');
  }, [content]);

  const handleSave = () => {
    onUpdateContent({ ...content, title, description, audioUrl, mood, type });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="echo-detail">
        <h2>{content.title}</h2>
        {content.description && <p>{content.description}</p>}
        {content.audioUrl && (
          <audio controls src={content.audioUrl}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        )}
        <div className="echo-meta">
          <span className="mood-tag">{content.mood}</span>
          <span className="type-tag">{content.type}</span>
          {content.duration > 0 && <span>{content.duration}s</span>}
        </div>
        <button onClick={() => setIsEditing(true)}>Éditer</button>
        <button onClick={() => onDeleteContent(content._id)}>Supprimer</button>
      </div>
    );
  }

  return (
    <div className="echo-editor">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre de l'écho"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Ce que cet écho évoque..."
      />
      <input
        type="url"
        value={audioUrl}
        onChange={e => setAudioUrl(e.target.value)}
        placeholder="URL du fichier audio"
      />
      <select value={mood} onChange={e => setMood(e.target.value)}>
        {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={type} onChange={e => setType(e.target.value)}>
        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <button onClick={handleSave}>Sauvegarder</button>
      <button onClick={() => setIsEditing(false)}>Annuler</button>
    </div>
  );
};

export default ContentEditor;
