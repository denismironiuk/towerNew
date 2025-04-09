import models from "../models/index.js";
const { UserCertification, Certification, User } = models;

// 🟩 Assign Certification to User
export const assignCertificationToUser = async (req, res) => {
  try {
    const { user_number, certification_id, valid_until } = req.body;

    if (!user_number || !certification_id || !valid_until) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const certification = await Certification.findByPk(certification_id);
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    const existing = await UserCertification.findOne({
      where: { user_number, certification_id },
    });

    if (existing) {
      return res.status(409).json({ error: 'Certification already assigned' });
    }

    const newAssignment = await UserCertification.create({
      user_number,
      certification_id,
      valid_until,
    });

    return res.status(201).json({
      message: 'Certification assigned successfully',
      assignment: newAssignment,
    });

  } catch (error) {
    console.error('Assignment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 🟩 Get All Assigned Certifications
export const getAllAssignedCertifications = async (req, res) => {
    try {
      const assignments = await UserCertification.findAll({
        include: [
          {
            model: Certification,
            attributes: ['id', 'name', 'description'],
          },
          {
            model: User,
            attributes: ['name', 'department', 'position'],
          }
        ],
        order: [['valid_until', 'DESC']],
      });
  
      const today = new Date();
  
      const formatted = assignments.map((item) => {
        const isExpired = new Date(item.valid_until) < today;
  
        return {
          id: item.id,
          employee_number: item.user_number,
          employee_name: item.User?.name,
          department: item.User?.department,
          position: item.User?.position,
          certification_id: item.certification_id,
          certification_name: item.Certification?.name,
          certification_description: item.Certification?.description,
          valid_until: item.valid_until,
          company: 'Amat',
          status: isExpired ? 'Expired' : 'Valid',
        };
      });
  
      res.json(formatted);
    } catch (error) {
      console.error('Error fetching assigned certifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  