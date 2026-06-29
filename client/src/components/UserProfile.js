import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser || {});
  const [loading, setLoading] = useState(!propUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data || { message: error.message });
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [propUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <div>
      <h1>Profil de {user.name}</h1>
      <p>Email : {user.email}</p>
      <p>Bio : {user.bio || '—'}</p>
    </div>
  );
};

export default UserProfile;
