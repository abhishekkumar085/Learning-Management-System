import User from '../model/user.models.js';
import AppError from '../utils/error.utils.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from '../utils/sendEmail.js';

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }
  if (password.length < 6) {
    return next(new AppError('password must be 6 character', 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'https://res.cloudinary.com/du9jzqlpt/upload',
    },
  });
  if (!user) {
    return next(new AppError('User registration failed,please try again'));
  }

  // TODO: file upload

  if (req.file) {
    console.log(req.file);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill',
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (err) {
      return next(new AppError('file not uploaded', err.message, 500));
    }
  }

  await user.save();
  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered Successfully!!',
    data: user,
  });
};

// Login functionality!!
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('All fields are required', 400));
    }

    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user) {
      console.log('User not found');
      return next(new AppError('Email and password do not match', 400));
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return next(new AppError('Email and password do not match', 400));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'User logged in succussfully!!',
      data: user,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
// logout functionality

const logout = (req, res) => {
  res.cookie('token', null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'User logout  successfully!!',
  });
};
// Get Profile Functionality
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: 'User details geting successfully!!',
      data: user,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
// forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('email is required!', 400));
    }
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('email not registered', 400));
    }
    // Generate the password reset token
    const resetToken = await user.generatePasswordResetToken();
    // Save the user with the reset token and expiry
    await user.save();

    // Create the reset password URL
    const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href="${resetPasswordURL}" target="_blank">Reset Password</a>. If the above link does not work, copy and paste this URL into your browser: ${resetPasswordURL}`;
    // Send the reset password email
    try {
      await sendEmail(email, subject, message);
      res.status(200).json({
        success: true,
        message: `Reset password token has been sent to ${email} successfully!`,
      });
    } catch (err) {
      // If email sending fails, clear the token and expiry fields
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;
      await user.save();
      return next(new AppError(err.message , 500));
    }
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
// Reset Password

const resetPassword = () => {};

export { register, login, logout, getProfile, forgotPassword, resetPassword };
