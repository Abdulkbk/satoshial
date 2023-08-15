import express from 'express'
import { signinUserHAndler, signupUserHAndler } from '../controller/auth'
import validateResource from '../middleware/validateResource'

const router = express.Router()


router.post('/signup', signupUserHAndler).post('/signin', signinUserHAndler)

export default router