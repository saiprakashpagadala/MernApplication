import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

// ======== CREATE JOB =======

export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;

  //validation
  if (!company || !position) {
    next("please provide all fields");
  }

  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({
    job,
  });
};

// ======= GET JOBS =======

export const getAllJobsController = async (req, res, next) => {
  //  commenting this for applying filters
  //   const jobs = await jobsModel.find({ createdBy: req.user.userId });

  const { status, workType, search, sort } = req.query;

  // conditions for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };

  // logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  // sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  // jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPages = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  res.status(200).json({
    // totalJobs: jobs.length,
    totalJobs,
    jobs,
    numOfPages,
  });
};

// ======== UPDATE JOB ========

export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  // validation
  if (!company || !position) {
    next("Please Provide All Fields");
  }

  // find Job
  const job = await jobsModel.findOne({ _id: id });

  // validation
  if (!job) {
    next(`no jobs found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your are No Authorized to update this Job");
    return;
  }
  const updatedJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  // res
  res.status(200).send({
    updatedJob,
  });
};

// ======== DELETE JOB ========

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  //find job
  const job = await jobsModel.findOne({ _id: id });

  // validation
  if (!job) {
    next("No Job Found With This Id");
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Are Not Autorized to Delete");
    return;
  }

  await job.deleteOne();
  res.status(200).json({
    message: "Successfully Job Deleted !",
  });
};

// ========  JOB STATS & FILTER ========

export const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    // search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // monthy or yearly stats

  let monthlyApplications = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // formatting with moment as requirement
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  // Default stats
  const defaultStats = {
    pending: stats.pending || 0,
    rejected: stats.rejected || 0,
    interview: stats.interview || 0,
    selected: stats.selected || 0,
  };

  // pass defaultStats if there is no data
  res
    .status(200)
    .json({ totalStats: stats.length, stats, monthlyApplications });
};
