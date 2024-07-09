import Course from '../model/course.model.js';
import AppError from '../utils/error.utils.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
// get All Course
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select('-lectures');
    res.status(200).json({
      success: true,
      message: 'All Courses!!',
      courses,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// get lectures by course id

const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Invalid course Id', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Course lectures getting successfully!!',
      lectures: course.lectures,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
// Create course
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError('All fields are required', 400));
    }
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: 'Dummy',
        secure_url: 'Dummy',
      },
    });
    if (!course) {
      return next(
        new AppError('course could not be create,please try again', 500)
      );
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
      });
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    }

    await course.save();
    res.status(200).json({
      success: true,
      message: 'course created successfully!',
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
// update course
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { runValidators: true }
    );

    if (!course) {
      return next(new AppError('course does not exists', 400));
    }
    await course.save();
    res.status(200).json({
      success: true,
      message: 'Course updated successfully!!',
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
// delete course
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return next(new AppError('Course does not exist', 400));
    }

    res.status(200).json({
      success: true,
      message: 'course deleted successfully!!',
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
};
