import express from 'express'
import { createPostHandler } from '../controller/post.controller'
import { bearerTokenMidlleware } from '../middleware/checkAuth'


const router = express.Router()

router.post('/', bearerTokenMidlleware, createPostHandler)

export default router