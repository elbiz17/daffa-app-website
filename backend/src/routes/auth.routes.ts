import express from 'express'
import AuthController from '../controllers/auth.controller'
import { authenticatedToken } from '../middleware/authenticatedToken'

const router = express.Router()

router.post("/sign-in", AuthController.signIn)
router.get("/me", authenticatedToken(['ADMIN', 'USER']), AuthController.me)


export default router