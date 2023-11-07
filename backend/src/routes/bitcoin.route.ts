import express from 'express'
import { bearerTokenMidlleware } from '../middleware/checkAuth'
import { generateAddressHandler, generateWalletHandler, bitTests } from '../controller/bitcoin.controller'

const router = express.Router()

router.post('/address', generateAddressHandler).get('/wallet', generateWalletHandler).post('/generate').get('/test', bitTests)

export default router

