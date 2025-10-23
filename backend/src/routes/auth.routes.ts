import express from 'express'
import AuthController from '../controllers/auth.controllers'

const router = express.Router()

router.post("/sign-in", AuthController.signIn)
router.post("/me", AuthController.me)


export default router