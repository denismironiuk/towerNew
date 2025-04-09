// const UserCertification = require("../models/UserCertification");


// exports.getUserCertifications = async (req, res) => {
//     try {
//         const user_number = req.user.id; // Get user ID from JWT

//         const certifications = await UserCertification.findAll({
//             where: { user_number: user_number },
//             include: [{ model: Certification, attributes: ["name"] }],
//             attributes: ["valid_until"]
//         });

//         res.json(certifications);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };
  
import Certification from "../models/Certification.js";

// Create a new certification
export const createCertification = async (req, res) => {
  try {
    const { name, expires } = req.body;
    const certification = await Certification.create({ name, expires });
    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all certifications
export const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll();
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a certification by ID
export const getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByPk(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    res.status(200).json(certification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a certification
export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const certification = await Certification.findByPk(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    await certification.update({ name, description });
    res.status(200).json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a certification
export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByPk(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    await certification.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
