import React from "react";
import styles from "./styles/ProfileSidebar.module.css";
import ProfilePic from "../../../assets/default.webp";
import TowerLogo from "../../../assets/Tower_Semiconductor.svg.png";
import { Link } from "react-router-dom";

const ProfileSidebar = ({ user, logout }) => {
  return (
    <div className={styles.sidebar}>
      <img src={TowerLogo} alt="Tower Semiconductor" className={styles.logo} />
      <img src={ProfilePic} alt="User" className={styles.profileImage} />

      <div className={styles.info}>
        <h2>👤 {user.name}</h2>
        <p>{user.position}</p>
        <p>{user.department}</p>
      </div>

      <nav className={styles.nav}>
        <ul>
          {user.position === "sam" && (
            <>
              <li><Link to="/sam/subordinates">👥 Subordinates</Link></li>
              <li><Link to="/sam/tasks">📋 Tasks</Link></li>
              <li><Link to="/sam/reports">📑 Reports</Link></li>
            </>
          )}
        </ul>
      </nav>

      <button className={styles.logout} onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfileSidebar;
