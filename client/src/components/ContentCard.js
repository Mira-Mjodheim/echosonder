import React from 'react';

const ContentCard = ({ content }) => (
  <article>
    <h2>{content.title}</h2>
    {content.description && <p>{content.description}</p>}
    <div className="echo-meta">
      <span className="mood-tag">{content.mood}</span>
      <span className="type-tag">{content.type}</span>
      {content.userId?.name && <span>par {content.userId.name}</span>}
    </div>
  </article>
);

export default ContentCard;
