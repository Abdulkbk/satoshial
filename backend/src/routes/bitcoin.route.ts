import express from 'express'
import { bearerTokenMidlleware } from '../middleware/checkAuth'
import { broadcastTransactionHandler, createTransactionHandler, generateAddressHandler, generateMasterKeysHandler, generateMnemonicHandler, getAddressHandler, getUtxosHandler } from '../controller/bitcoin.controller'

const router = express.Router()

router.get('/get-address', bearerTokenMidlleware, generateAddressHandler)
  .get('/mnemonics', bearerTokenMidlleware, generateMnemonicHandler)
  .post('/master-keys', bearerTokenMidlleware, generateMasterKeysHandler)
  .get('/utxos', bearerTokenMidlleware, getUtxosHandler)
  .post('/create-transaction', bearerTokenMidlleware, createTransactionHandler)
  .post('/broadcast-transaction', bearerTokenMidlleware, broadcastTransactionHandler)

export default router

