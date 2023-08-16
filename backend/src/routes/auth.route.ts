import express from 'express'
import { signinUserHandler, signupUserHandler } from '../controller/auth.controller'
import validateResource from '../middleware/validateResource'

const router = express.Router()


router.post('/signup', signupUserHandler).post('/signin', signinUserHandler)

export default router