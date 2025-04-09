import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Profile from "../components/Profile";
import { fetchUserProfile } from "../services/profileServices";
import AuthContext from "../../../context/AuthContext";

const ProfilePage = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        setProfile(data);
      } catch (error) {
        logout();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadProfile();
  }, [token]);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <Profile>
      <Profile.Sidebar user={profile} logout={logout} />
      <Profile.Content user={profile} />
      <Profile.Certifications certifications={profile.certifications} />
      <Profile.Actions/>
    </Profile>
  );
};

export default ProfilePage;
