import User from "../models/User.js";
import authModel from "../services/auth.service.js";

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
    const accessToken = authModel.generateAccessToken(user);
    const refreshToken = authModel.generateRefreshToken(user);
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // });
   // res.cookie("accessToken", accessToken, {
   //    httpOnly: true,
   //    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
   //    secure: process.env.NODE_ENV === "production" ? true : false,
   //    maxAge: 24 * 60 * 60 * 1000, // 24 hours
   //  });
   //  res.cookie("refreshToken", refreshToken, {
   //    httpOnly: true,
   //    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
   //    secure: process.env.NODE_ENV === "production",
   //    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
   //  });
const isLocalhost = req.hostname.includes("localhost")
    
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  sameSite: "none",
  secure: !isLocalhost,
  maxAge: 24 * 60 * 60 * 1000,
})

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "none",
  secure: !isLocalhost,
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

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

    const accessToken = authModel.generateAccessToken(user);
    const refreshToken = authModel.generateRefreshToken(user);
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
}
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next({ status: 401, message: "No refresh token provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return next({ status: 401, message: "Invalid or expired refresh token" });
    }
    const user = await authModel.login(decoded.email, null); // No password needed
    if (!user) {
      return next({ status: 401, message: "User not found" });
    }
    const newAccessToken = authModel.generateAccessToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.status(200).json({
      message: "Token refreshed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next({ status: 500, message: err.message || "Token refresh error" });
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authModel.logout(refreshToken);
      // await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
    } else {
      return next({ status: 401, message: "User is not logged in" });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next({ status: 500, message: err.message || "Logout error" });
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await authModel.getUserInfo(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User info retrieved", user });
  } catch (err) {
    next({ status: 500, message: err.message || "Error fetching user info" });
  }
};

const authMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash")
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
};

export { login, register, logout, refreshToken, getUserInfo, authMe };
