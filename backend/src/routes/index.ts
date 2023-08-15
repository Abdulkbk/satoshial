import express from 'express'
import auth from '../routes/auth'
const router = express.Router()

router.get('/api/v1/healthcheck', (_, res) => res.sendStatus(200))

router.use('/api/v1/auth', auth)


export default router