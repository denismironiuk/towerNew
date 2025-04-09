// controllers/safetyAuditController.js

import SafetyAudit from '../models/SafetyAudit.js';

// Fetch all safety audits
export const getAllSafetyAudits = async (req, res) => {
  try {
    const audits = await SafetyAudit.findAll();
    res.status(200).json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single safety audit by ID
export const getSafetyAuditById = async (req, res) => {
  try {
    const audit = await SafetyAudit.findByPk(req.params.id);
    if (audit) {
      res.status(200).json(audit);
    } else {
      res.status(404).json({ message: 'Safety Audit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new safety audit
export const createSafetyAudit = async (req, res) => {
  try {
    const newAudit = await SafetyAudit.create(req.body);
    res.status(201).json(newAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing safety audit
export const updateSafetyAudit = async (req, res) => {
  try {
    const [updated] = await SafetyAudit.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAudit = await SafetyAudit.findByPk(req.params.id);
      res.status(200).json(updatedAudit);
    } else {
      res.status(404).json({ message: 'Safety Audit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a safety audit
export const deleteSafetyAudit = async (req, res) => {
  try {
    const deleted = await SafetyAudit.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Safety Audit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
