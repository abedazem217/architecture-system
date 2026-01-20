const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.use(auth);

router.get("/", listProjects);
router.get("/:id", getProject);

router.post("/", authorize("admin", "architect"), createProject);
router.put("/:id", authorize("admin", "architect"), updateProject);
router.delete("/:id", authorize("admin", "architect"), deleteProject);

module.exports = router;
