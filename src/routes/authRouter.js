import express from "express";
import {
  login,
  register,
  logout,
  refreshToken,
  authMe
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", authMe);

export default router;
