import Router from 'express';
import {
  buySubscription,
  cancelSubscription,
  getAllPayment,
  getRazorPayApiKey,
  verifySubscription,
} from '../controller/payment.controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/razorpay-key').get(isLoggedIn, getRazorPayApiKey);
router.route('/subscribe').post(isLoggedIn, buySubscription);

router.route('/verify').post(isLoggedIn, verifySubscription);
router.route('/unsubscribe').post(isLoggedIn, cancelSubscription);

router.route('/').get(isLoggedIn, authorizedRoles('ADMIN'), getAllPayment);

export default router;
