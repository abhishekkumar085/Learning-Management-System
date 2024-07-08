import User from '../model/user.models.js';
import AppError from '../utils/error.utils.js';
import bcrypt from 'bcrypt';

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

export { register, login, logout, getProfile };
