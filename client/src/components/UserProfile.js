import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response.data);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      <p>Email : {user.email}</p>
      <p>Nom : {user.lastname}</p>
      <p>Prénom : {user.firstname}</p>
    </div>
  );
};

export default UserProfile;