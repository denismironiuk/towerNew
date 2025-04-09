import React from "react";
import styles from "./styles/ProfileActions.module.css";

const ProfileActions = ({ onEdit, onDelete }) => {
  return (
    <div className={styles.actions}>
      <button onClick={onEdit}>✏️ Edit</button>
      <button onClick={onDelete}>🗑️ Delete</button>
    </div>
  );
};

export default ProfileActions;
