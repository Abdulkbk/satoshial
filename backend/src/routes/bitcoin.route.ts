import express from 'express'
import { bearerTokenMidlleware } from '../middleware/checkAuth'
import { getAddressHandler, generateWalletHandler, bitTests } from '../controller/bitcoin.controller'

const router = express.Router()

router.post('/address', bearerTokenMidlleware, getAddressHandler).get('/wallet', generateWalletHandler).post('/generate').get('/test', bearerTokenMidlleware, bitTests)

export default router

