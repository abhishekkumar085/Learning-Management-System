const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'user name is required'],
      minLength: [3, 'Name must be at least 5 char'],
      maxLength: [50, 'Name must be less than 50 char'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'user email is required'],
      unique: true,
      lowerCase: true,
      unique: [true, 'already registered'],
    },
    password: {
      type: String,
      select: false,
    },
    //   confirmPassword: {
    //     type: string,
    //   },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  jwtToken() {
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: '24h',
    });
  },
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
