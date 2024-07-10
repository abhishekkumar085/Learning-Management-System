import Payment from '../model/payment.model.js';
import User from '../model/user.models.js';
import { razorpay } from '../server.js';
import AppError from '../utils/error.utils.js';
import Razorpay from 'razorpay';

export const getRazorPayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Razorpay API KEY!',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (user.role === 'ADMIN') {
      return next(new AppError('Admin cannot access', 400));
    }
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Subscribed Successfully!!',
      subscription_id: subscription.id,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('invalid user', 400));
    }
    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError('Payment not verified , Please try again', 400));
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = 'active';
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Payment Verified Successfully!!',
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
// cancellation payment
export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (user.role === 'ADMIN') {
      return next(new AppError('Admin cannot access', 400));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    user.subscription.status = subscription.status;
    await user.save();
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const getAllPayment = async (req, res, next) => {
  try {
    const { count } = req.query;

    const subscriptions = await razorpay.subscriptions.all({
      count: count || 10,
    });

    return res.status(200).json({
      success: true,
      message: 'All Payments',
      subscriptions,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
