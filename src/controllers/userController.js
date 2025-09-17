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
const addPreference = async (req, res, next) => {
  try {
    // if (req.user.id !== req.params.id) {
    //   return next({ status: 403, message: 'Forbidden: You can only modify your own preferences' });
    // }
    const { type, value } = req.body;
    if (!type || !value || !["food", "activities"].includes(type)) {
      return next({
        status: 400,
        message: 'Invalid type (must be "food" or "activities") or value',
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    if (user.preferences[type].includes(value)) {
      return next({
        status: 400,
        message: `${value} already exists in ${type}`,
      });
    }
    user.preferences[type].push(value);
    await user.save();
    res
      .status(200)
      .json({
        message: `${value} added to ${type} preferences`,
        user: { ...user.toObject(), passwordHash: undefined },
      });
  } catch (err) {
    next({ status: 500, message: err.message || "Error adding preference" });
  }
};

const removePreference = async (req, res, next) => {
  try {
    // if (req.user.id !== req.params.id) {
    //   return next({ status: 403, message: 'Forbidden: You can only modify your own preferences' });
    // }
    const { type, value } = req.body;
    if (!type || !value || !["food", "activities"].includes(type)) {
      return next({
        status: 400,
        message: 'Invalid type (must be "food" or "activities") or value',
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    if (!user.preferences[type].includes(value)) {
      return next({ status: 400, message: `${value} not found in ${type}` });
    }
    user.preferences[type] = user.preferences[type].filter(
      (item) => item !== value
    );
    await user.save();
    res
      .status(200)
      .json({
        message: `${value} removed from ${type} preferences`,
        user: { ...user.toObject(), passwordHash: undefined },
      });
  } catch (err) {
    next({ status: 500, message: err.message || "Error removing preference" });
  }
};

const addSharedTrip = async (req, res, next) => {
  try {
    // if (req.user.id !== req.params.id) {
    //   return next({ status: 403, message: 'Forbidden: You can only modify your own shared trips' });
    // }
    const { tripId } = req.body;
    if (!tripId || !mongoose.isValidObjectId(tripId)) {
      return next({ status: 400, message: "Invalid tripId" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return next({ status: 404, message: "Trip not found" });
    }
    if (user.sharedTrips.includes(tripId)) {
      return next({ status: 400, message: "Trip already shared with user" });
    }
    user.sharedTrips.push(tripId);
    await user.save();
    res
      .status(200)
      .json({
        message: "Trip added to shared trips",
        user: { ...user.toObject(), passwordHash: undefined },
      });
  } catch (err) {
    next({ status: 500, message: err.message || "Error adding shared trip" });
  }
};

const removeSharedTrip = async (req, res, next) => {
  try {
    // if (req.user.id !== req.params.id) {
    //   return next({ status: 403, message: 'Forbidden: You can only modify your own shared trips' });
    // }
    const { tripId } = req.body;
    if (!tripId || !mongoose.isValidObjectId(tripId)) {
      return next({ status: 400, message: "Invalid tripId" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }
    if (!user.sharedTrips.includes(tripId)) {
      return next({ status: 400, message: "Trip not found in shared trips" });
    }
    user.sharedTrips = user.sharedTrips.filter(
      (id) => id.toString() !== tripId
    );
    await user.save();
    res
      .status(200)
      .json({
        message: "Trip removed from shared trips",
        user: { ...user.toObject(), passwordHash: undefined },
      });
  } catch (err) {
    next({ status: 500, message: err.message || "Error removing shared trip" });
  }
};

export {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  addPreference,
  addSharedTrip,
  removePreference,
  removeSharedTrip,
};
