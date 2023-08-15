import express from 'express'
import auth from '../routes/auth'
import { bearerTokenMidlleware } from '../middleware/checkAuth'
const router = express.Router()

router.get('/api/v1/healthcheck', (_, res) => res.sendStatus(200))

router.get('/api/v1/test', bearerTokenMidlleware, (_, res) => res.send('Access passed'))

router.use('/api/v1/auth', auth)


export default router