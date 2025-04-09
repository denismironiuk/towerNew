import models from "../models/index.js";
const {UserTutorial,Tutorial,User} =models

export const assignTutorialToUser = async (req, res) => {
  try {
    const { employee_number, tutorial_id, valid_until } = req.body;

    if (!employee_number || !tutorial_id || !valid_until) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tutorial = await Tutorial.findByPk(tutorial_id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }

    const existing = await UserTutorial.findOne({
      where: { employee_number, tutorial_id },
    });

    if (existing) {
      return res.status(409).json({ error: 'Tutorial already assigned' });
    }

    const newAssignment = await UserTutorial.create({
      employee_number,
      tutorial_id,
      valid_until, // use as-is from client
    });

    return res.status(201).json({
      message: 'Tutorial assigned successfully',
      assignment: newAssignment,
    });

  } catch (error) {
    console.error('Assignment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




export const getAllAssignedTutorials = async (req, res) => {
  try {
    const assignments = await UserTutorial.findAll({
      include: [
        {
          model: Tutorial,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: User,
          attributes: ['name', 'department', 'position'], // include what you need
        }
      ],
      order: [['valid_until', 'DESC']],
    });

    const today = new Date();

    const formatted = assignments.map((item) => {
      const isExpired = new Date(item.valid_until) < today;

      return {
        id: item.id,
        employee_number: item.employee_number,
        employee_name: item.User?.name,               // ✅ from joined users table
        department: item.User?.department,             // optional
        position: item.User?.position,                 // optional
        tutorial_id: item.tutorial_id,
        tutorial_name: item.Tutorial?.name,
        tutorial_description: item.Tutorial?.description,
        valid_until: item.valid_until,
        company:'Amat',
        status: isExpired ? 'Expired' : 'Valid',
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching assigned tutorials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
