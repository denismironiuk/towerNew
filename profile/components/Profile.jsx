
import React from "react";
import ProfileSidebar from "./Profile.Sidebar";
import ProfileContent from "./Profile.Content";
import ProfileCertifications from "./Profile.Certifications";
import ProfileActions from "./Profile.Actions"; // Only for SAM/Admin
import styles from "./styles/Profile.module.css";

const Profile = ({ children }) => {
  return <div className={styles.profileContainer}>{children}</div>;
};

// ✅ Subcomponents
Profile.Sidebar = ProfileSidebar;
Profile.Content = ProfileContent;
Profile.Certifications = ProfileCertifications;
Profile.Actions = ProfileActions;

export default Profile;
