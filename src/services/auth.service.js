import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authModel = {
  async login(email, password) {
    const emailLowerCase = email.toLowerCase();
    try {
      const user = await User.findOne({ email: emailLowerCase });
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return null;
      }

      const { passwordHash, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err) {
      throw new Error("Login error");
    }
  },

  async register(name, email, password, pref_food = [], pref_activities = []) {
    
    const emailLowerCase = email.toLowerCase();
    try {
      const existingUser = await User.findOne({email: emailLowerCase });
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email: emailLowerCase,
        passwordHash,
        preferences: { activities: pref_activities, food: pref_food },
        sharedTrips: [],
      });
      await user.save();
      const { passwordHash: _, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err) {
      throw new Error(err.message || "Registration error");
    }
  },

  async logout(refreshToken) {
    try {
      const user = User.updateOne(
        { refreshToken },
        { $unset: { refreshToken: "" } }
      );
      if (!user) {
        return "null";
      }
    } catch (err) {
      throw new Error("Logout error");
    }
  },

  async getUserInfo(userId) {
    try {
      const user = await User.findById(userId)
        .select("name email preferences sharedTrips createdAt updatedAt")
        .populate("sharedTrips", "origin destination startDate endDate");
      if (!user) {
        return null;
      }
      const { passwordHash, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err) {
      throw new Error("Error fetching user info");
    }
  },

  generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
  },

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  },
};

export default authModel;
