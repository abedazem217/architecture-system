const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true, trim: true },
    client: { type: String, trim: true, default: "" },
    status: { type: String, default: "Active" },
    deadline: { type: String, default: "" },

    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
