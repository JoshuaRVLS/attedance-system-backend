import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
} from "../controllers/student.controller";
import { upload } from "../utils/multer";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", upload.single("file"), createUser);
router.patch("/:id", updateUser);

export default router;
