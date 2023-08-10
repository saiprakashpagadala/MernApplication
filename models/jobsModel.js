import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      require: [true, "Company Name is Required"],
    },
    position: {
      type: String,
      require: [true, "Job Position is Required"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "interview", "selected"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract-based"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      require: [true, "work location is required"],
      default: "Texas",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
