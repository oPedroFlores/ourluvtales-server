// user/controllers/UserController.js
const UserService = require('./Service');

module.exports.register = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ user, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

module.exports.login = async (req, res) => {
  try {
    const token = await UserService.authenticateUser(
      req.body.email,
      req.body.password,
    );
    res.json({ token, success: true });
  } catch (error) {
    res.status(401).json({ error: error.message, success: false });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json({ user, success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = req.user;
    const updatedUser = await UserService.updateUser(
      req.params.id,
      req.body,
      user,
    );
    res.json({ updatedUser, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

module.exports.checkEmail = async (req, res) => {
  try {
    const emailExists = await UserService.checkEmail(req.params.email);
    res.json({ emailExists, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};
