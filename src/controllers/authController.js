import authModel from "../models/authModel.js";
import jwt from "jsonwebtoken";

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next({ status: 400, message: "email or password missing" });
    }
    const user = await authModel.login(email, password);
    if (!user) {
      next({ status: 401, message: "invalid email or password" });
    }
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next({ status: 500, message: err.message || "Login error" });
  }
}
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      next({ status: 400, message: "Name, email, and password required" });
      return;
    }

    const user = await authModel.register(name, email, password);
    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
}

export { login, register };
