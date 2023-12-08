import { Request, Response, } from "express";
import { createAddress, createUserWallet, getAddress, getWallet } from "../service/user.service";
import { broadcastTx, getUtxosFromAddress } from "../utils/blockstream-api";
import { sumUtxoValues } from "../utils/helper";
import { Address, DecoratedUtxo, SignedTransactionData } from "../types/bitcoin";
import { NETWORK, changeAddressBatch, createAddressBatch, createDecoratedUTXOs, createTransaction, generateNewMnemonic, signTransaction } from "../service/bitcoin.service";
import { mnemonicToSeed } from 'bip39'
import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import logger from "../utils/logger";

const { fromSeed, fromBase58 } = BIP32Factory(ecc);

const derivationPath = "m/84'/0'/0'";


// Generate Mnemonics /  wallet phrase
export const generateMnemonicHandler = async (req: any, res: Response) => {
  logger.info("generate mnemonics handler")
  try {
    const mnemonic = await generateNewMnemonic()

    return res.status(201).json({ success: true, mnemonic })
  } catch (error) {
    throw error
  }
}

// Generate Master private and public key
export const generateMasterKeysHandler = async (req: any, res: Response) => {
  logger.info("generate masterkeys handler")
  try {
    const { password, phrase } = req.body
    const { userId } = req.user

    if (!password || !phrase) {
      return res.status(403).json({ success: false, message: 'Password or Phrase not provided' })
    }
    const seed = await mnemonicToSeed(phrase, password)
    const node = fromSeed(seed, NETWORK)

    const xpriv = node.toBase58()
    const xpub = node.derivePath(derivationPath).neutered().toBase58()

    const data = await createUserWallet({ userId, mnemonics: phrase, privateKey: xpriv, publicKey: xpub })

    return res.status(201).json({ success: true, data })

  } catch (error) {
    throw error
  }
}

// Generate addresses
export const generateAddressHandler = async (req: any, res: Response) => {
  logger.info("generate address handler")
  try {
    const { addressType } = req.query
    const { userId } = req.user



    const wallet = await getWallet(userId)


    const node: BIP32Interface = fromBase58(wallet?.publicKey!, NETWORK).derivePath("0/0")

    const currentAddressBatch: Address[] = createAddressBatch(wallet?.publicKey!, node, addressType)
    const currentChangeAddressBatch: Address[] = changeAddressBatch(wallet?.publicKey!, node, addressType)

    const data = { address: currentAddressBatch, changeAddress: currentChangeAddressBatch }
    return res.status(200).json({ success: true, data })


  } catch (error) {
    throw error
  }
}


export const getUtxosHandler = async (req: any, res: Response) => {
  logger.info("generate utxos handler")
  try {
    const { addressType } = req.query



    const { userId } = req.user

    const wallet = await getWallet(userId)

    const node: BIP32Interface = fromBase58(wallet?.publicKey!, NETWORK).derivePath("0/0")

    const currentAddressBatch: Address[] = createAddressBatch(wallet?.publicKey!, node, addressType)
    const currentChangeAddressBatch: Address[] = changeAddressBatch(wallet?.publicKey!, node, addressType)

    // logger.info(currentAddressBatch, "current address batch")

    // logger.info(currentChangeAddressBatch, "current change address batch")
    const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch]

    const decoratedUtxo: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, node)

    res.status(200).json({ success: true, decoratedUtxo })
  } catch (error) {

  }

}

export const createTransactionHandler = async (req: any, res: Response) => {
  logger.info("create transaction handler")
  try {
    const { recipientAddress, amountInSatoshi } = req.body
    const { addressType } = req.query
    const userId = req.user.userId


    const wallet = await getWallet(userId)

    const root = fromBase58(wallet?.privateKey!, NETWORK)

    const currentAddressBatch: Address[] = createAddressBatch(wallet?.publicKey!, root, addressType)
    const currentChangeAddressBatch: Address[] = changeAddressBatch(wallet?.publicKey!, root, addressType)

    const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch]


    const decoratedUtxo: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, root)



    const transaction = await createTransaction(decoratedUtxo, recipientAddress, amountInSatoshi, currentChangeAddressBatch[0], addressType)

    const signTransactionHex: SignedTransactionData = await signTransaction(transaction, root)

    const data = {
      tHex: signTransactionHex,
      transaction
    }

    return res.status(201).json({ success: true, data })


  } catch (error) {
    throw error
  }
}

export const broadcastTransactionHandler = async (req: any, res: Response) => {
  logger.info("broadcast transaction handler")
  try {
    const { tHex } = req.body

    const data = await broadcastTx(tHex)
    return res.status(201).json({ success: true, data })
  } catch (error) {

  }
}

export async function getAddressHandler(req: any, res: Response) {
  try {
    const wallet = await getWallet(req.user.userId)
    let address

    if (wallet) {
      address = await getAddress(wallet.id)
    }


    return res.status(201).json({ address })
  } catch (error) {
    console.log(error);

  }
}


