import React from "react";
import styles from "./styles/ProfileContent.module.css";

const ProfileContent = ({ user }) => {
  return (
    <div className={styles.content}>
    <h2>User Information</h2>
    <p className={styles.userDetails}>📧 Email: <span>{user.email}</span></p>
    <p className={styles.userDetails}>🏢 Department: <span>{user.department}</span></p>
  </div>
  );
};

export default ProfileContent;
