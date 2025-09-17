import express from "express";
import {
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  addPreference,
  removePreference,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/preferences", addPreference);
router.delete("/:id/preferences", removePreference);

export default router;
