import userModel from '../model/user_schema.js';

import emailValidator from 'email-validator';
import bcrypt from 'bcrypt';

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required!',
    });
  }

  // const validEmail = emailValidator.validate(email);
  const validEmail = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
  const email_check = email.match(validEmail);
  if (!email_check) {
    return res.status(400).json({
      success: false,
      message: 'Please Providexx a valid email',
    });
  }
  if (password != confirmPassword) {
    return res.status(400).json({
      success: false,
      message: `Password and confirm password doesn't match`,
    });
  }

  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Registered successfully!!',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Account Already exists with provided email id',
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

// for signin
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required!!',
    });
  }
  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select('+password');

    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: 'invalid credentials',
      });
    }

    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie('token', token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};
// Get User

const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
      msg: 'User Getting successfully!!',
    });
  } catch (e) {
    return res.status(400).json({
      success: false,

      message: `Something went wrong!! ${e.message}`,
    });
  }
};

// logout user

const logout = (req, res) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };

    res.cookie('token', null, cookieOption);
    res.status(200).json({
      success: true,
      message: 'Logout Successfully!!',
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      message: err.message,
    });
  }
};

export { signup, signin, getUser, logout };
