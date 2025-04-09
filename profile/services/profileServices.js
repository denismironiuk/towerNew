import axiosInstance from "../../../utils/axiosConfig"; // ✅ Centralized Axios instance

// ✅ Fetch logged-in user profile
export const fetchUserProfile = async (token) => {
  try {
    const response = await axiosInstance.get("/user-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to fetch profile";
  }
};

// ✅ Fetch another user's profile (For SAM viewing subordinates)
export const fetchUserProfileById = async (userId, token) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching user profile for ID: ${userId}`, error.response?.data || error);
    throw error.response?.data?.message || "User not found";
  }
};

// ✅ Update profile (For user updating their own profile)
export const updateUserProfile = async (userId, profileData, token) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user profile:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to update profile";
  }
};

// ✅ Delete user (For SAM or Admin)
export const deleteUserProfile = async (userId, token) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting user profile for ID: ${userId}`, error.response?.data || error);
    throw error.response?.data?.message || "Failed to delete user";
  }
};
