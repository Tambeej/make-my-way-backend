import User from "../models/User.js";
import Trip from "../models/Trip.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash"); // Exclude passwordHash
    res.status(200).json(users);
  } catch (err) {
    next({ status: 500, message: err.message || "Error fetching users" });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next({ status: 500, message: err.message || "Error fetching user" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next({
        status: 403,
        message: "Forbidden: You can only update your own data",
      });
    }
    const { name, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;
    if (Object.keys(updates).length === 0) {
      return next({ status: 400, message: "No valid fields to update" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    next({ status: 500, message: err.message || "Error updating user" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    await Trip.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "User and associated trips deleted successfully" });
  } catch (err) {
    next({ status: 500, message: err.message || "Error deleting user" });
  }
};

export { updateUser, deleteUser, getAllUsers, getUserById };
