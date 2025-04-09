import React from "react";
import styles from "./styles/ProfileCertifications.module.css";
const ProfileCertifications = ({ certifications }) => {
  return (
    <div className={styles.certifications}>
    <h2>Certifications</h2>
    <ul>
      {certifications.map((cert, index) => (
        <li key={index}>{cert.name} <span>{cert.valid_until}</span></li>
      ))}
    </ul>
  </div>
  );
};

export default ProfileCertifications;
