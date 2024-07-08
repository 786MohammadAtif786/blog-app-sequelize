const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const response = require("../utils/response");

exports.register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    if(!name || !email || !password) {
      return response(res, false, null, "All Fields are required", 400);
    }
    const existingEmail = await User.findOne({ where: { email } });
    if(existingEmail) {
      return  response(res, false, null, "Email is Already Exist. Please Login Continue", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, isAdmin });
    return response(res, true, user, "User registered successfully", 201);
    
  } catch (error) {
    return response(res, false, error, "Failed to register user", 500);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response(res, false, null, "User Not Found", 404);
    }
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response(res, false, null, "Invalid credentials", 404);
    }

    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    user.password = undefined;
    const userObj = user.dataValues.token = token;
    return response(res, true, userObj && user, 'Login successfully', 200);
  } catch (error) {
    return response(res, false, null, 'Failed to login', 500);
  }
};
