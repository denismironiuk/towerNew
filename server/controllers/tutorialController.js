import Tutorial from "../models/Tutorial.js";

// Get all tutorials
export const getAllTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.findAll();
    res.json(tutorials);
  } catch (error) {
    console.error("❌ Failed to fetch tutorials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get one tutorial by ID
export const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tutorial" });
  }
};

// Create a new tutorial
export const createTutorial = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTutorial = await Tutorial.create({ name, description });
    res.status(201).json(newTutorial);
  } catch (error) {
    res.status(500).json({ error: "Error creating tutorial" });
  }
};

// Update a tutorial
export const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }

    const { name, description } = req.body;
    await tutorial.update({ name, description });

    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ error: "Error updating tutorial" });
  }
};

// Delete a tutorial
export const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }

    await tutorial.destroy();
    res.json({ message: "Tutorial deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tutorial" });
  }
};
