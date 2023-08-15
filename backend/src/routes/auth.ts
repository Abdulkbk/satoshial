import express from 'express'
import { signupUserHAndler } from '../controller/auth'
import validateResource from '../middleware/validateResource'

const router = express.Router()


router.post('/signup', signupUserHAndler)

export default router