import { Router } from "express";
import { getClasses, getClass } from "../controllers/class.controller";

const router = Router();

router.get("/", getClasses);
router.get("/:id", getClass);

export default router;
