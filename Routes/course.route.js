import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
} from '../controller/course.controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
const router = new Router();

// router.get('/', getAllCourses);
// router.get('/:id', getLecturesByCourseId);
// we can also use like this

router
  .route('/')
  .get(isLoggedIn, getAllCourses)
  .post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
  );

router
  .route('/:id')
  .get(isLoggedIn, getLecturesByCourseId)
  .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
  .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse);

export default router;
