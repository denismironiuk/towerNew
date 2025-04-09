import fs from "fs";
import path from "path";

/**
 * Groups uploaded files by their corresponding local ID.
 * 
 * @param {Array} files - Array of uploaded files (from multer).
 * @param {Array|string} fileMaps - Array or single value mapping each file to a local_id.
 * @returns {Object} - An object mapping local_id to an array of files.
 */
export const groupFilesByLocalId = (files, fileMaps) => {
  const map = {};

  if (files && files.length > 0) {
    files.forEach((file, index) => {
      const localId = Array.isArray(fileMaps) ? fileMaps[index] : fileMaps;

      if (!map[localId]) {
        map[localId] = [];
      }
      map[localId].push(file);
    });
  }

  return map;
};

/**
 * Saves uploaded files to disk and returns their public URLs.
 * 
 * @param {Array} files - Array of files to save.
 * @returns {Array} - Array of public file URLs.
 */
export const saveFiles = (files) => {
  const fileUrls = [];

  files.forEach((file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadDir = path.resolve("uploads");

    // Ensure uploads folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    fileUrls.push(`/uploads/${fileName}`);
  });

  return fileUrls;
};
