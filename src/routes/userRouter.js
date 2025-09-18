import express from "express";
import {
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  addPreference,
  removePreference
} from "../controllers/userController.js";
import { getUserInfo } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authMiddleware.js";
import verifyToken from '../middlewares/verifyJwt.js'

const router = express.Router();

router.use(authenticate);

router.get("/", getAllUsers);
router.get('/me', verifyToken, getUserInfo);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/preferences", addPreference);
router.delete("/:id/preferences", removePreference);


export default router;
