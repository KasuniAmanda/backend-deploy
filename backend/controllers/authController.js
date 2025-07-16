const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = 'your_jwt_secret_key';

// Signup route
const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login route
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout route
const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  logout
};
