const Project = require("../models/Project");

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { name, client = "", status = "Active", deadline = "" } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      owner: req.user._id,
      name: name.trim(),
      client: client.trim(),
      status,
      deadline,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects
exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/projects/:id  (update fields + optional note push)
exports.updateProject = async (req, res) => {
  try {
    const { name, client, status, deadline, note } = req.body;

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (typeof name === "string") project.name = name.trim();
    if (typeof client === "string") project.client = client.trim();
    if (typeof status === "string") project.status = status;
    if (typeof deadline === "string") project.deadline = deadline;

    if (typeof note === "string" && note.trim()) {
      project.notes.unshift({ text: note.trim() });
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
