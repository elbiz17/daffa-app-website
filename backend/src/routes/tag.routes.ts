import { Router } from "express";
import { TagsController } from "../controllers/tags.controller";
import { authenticatedToken } from "../middleware/authenticatedToken";

const router = Router();

router.get("/", authenticatedToken(['ADMIN']), TagsController.getAllTags)


export default router;

