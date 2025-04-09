import Annualplan from '../models/AnnualPlan.js';
import dayjs from 'dayjs';

// GET all plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Annualplan.findAll();

    const events = plans.map((plan) => {
      const date = dayjs(plan.dueDate).format('YYYY-MM-DD');

      const startTime = plan.startTime || '09:00:00';
      let endTime = plan.endTime || '10:00:00';

      // Ensure endTime is after startTime
      if (startTime === endTime) {
        endTime = dayjs(`${date}T${startTime}`).add(1, 'hour').format('HH:mm:ss');
      }

      const start = dayjs(`${date}T${startTime}`).toISOString();
      const end = dayjs(`${date}T${endTime}`).toISOString();

      return {
        id: plan.id,
        title: plan.activity,
        start,
        end,
        allDay: false,
        backgroundColor: plan.status === 'completed' ? '#4caf50' : '#000',
        textColor: '#fff',
        borderColor: '#000',
        status: plan.status,
        recurrence: plan.recurrence,
        activity: plan.activity,
        dueDate: plan.dueDate,
        category: plan.category,
        type: plan.type,
        owner: plan.owner,
        reference: plan.reference,
        createdBy: plan.createdBy,
      };
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST - create a new plan
export const createPlan = async (req, res) => {
  try {
    const newPlan = await Annualplan.create(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

// PUT - update an existing plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await Annualplan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const { start, end, title, status, recurrence, activity, category, type, reference, owner, createdBy } = req.body;

    const dueDate = dayjs(start).format('YYYY-MM-DD');
    const startTime = dayjs(start).format('HH:mm:ss');
    const endTime = dayjs(end).format('HH:mm:ss');

    await plan.update({
      activity: activity || title,
      dueDate,
      startTime,
      endTime,
      status,
      recurrence,
      category,
      type,
      reference,
      owner,
      createdBy,
    });

    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
