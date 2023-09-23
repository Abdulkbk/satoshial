import express from 'express'
import { createPostHandler, getPostHandler, getPostByIdHandler } from '../controller/post.controller'
import { bearerTokenMidlleware } from '../middleware/checkAuth'


const router = express.Router()

router.post('/', bearerTokenMidlleware, createPostHandler).get('/', getPostHandler).get('/:id', getPostByIdHandler)

export default router