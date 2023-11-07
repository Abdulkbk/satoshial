// const bitcoin = require('bitcoinjs-lib')
import { Psbt, networks, payments } from 'bitcoinjs-lib';
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Address } from '../types/bitcoin';
const coinselect = require('coinselect')
import config from 'config'
import { Axios } from '../utils/helper';


const { fromSeed, fromBase58 } = BIP32Factory(ecc);

const NETWORK = networks.testnet

export const getUnspentUtxo = async () => {
  try {
    const response = await Axios("getbalance")
    // console.log(response);
    return response

  } catch (error) {
    throw error
  }
}

export const getNewMnemonic = async (strength?: number): Promise<string> => {
  const mnemonic = generateMnemonic(strength)
  return mnemonic
}

export const getMasterPrivateKey = async (mnemonic: string): Promise<string> => {
  const seed = await mnemonicToSeed(mnemonic)
  const privateKey = fromSeed(seed, NETWORK)
  return privateKey.toBase58()
}


export const getXpubFromPrivateKey = (privateKey: string, derivationPath: string): string => {
  const privKey = fromBase58(privateKey, NETWORK)
  const child = privKey.derivePath(derivationPath).neutered()

  const xpub = child.toBase58()

  return xpub
}


export const deriveChildPublicKey = (xpub: string, derivationPath: string): string => {
  const node = fromBase58(xpub, NETWORK)

  const child = node.derivePath(derivationPath).neutered()

  return child.toBase58()
}


export const getAddressFromChildPubKey = (key: string): payments.Payment => {
  const addr = fromBase58(key, NETWORK)
  const address = payments.p2wpkh({ pubkey: addr.publicKey, network: NETWORK })
  return address
}

export const signTransaction = async (psbt: Psbt, mnemonic: string): Promise<Psbt> => {
  const seed = await mnemonicToSeed(mnemonic)
  const root = fromSeed(seed, NETWORK)

  psbt.signAllInputsHD(root)
  // psbt.validateSignaturesOfAllInputs()
  psbt.finalizeAllInputs()
  return psbt
}


export const createTransaction = async (utxos: [], recipientAddress: string, amountInSatoshi: number, changeAddress: Address) => {
  const { inputs, outputs, fee } = coinselect(utxos, [
    {
      address: recipientAddress,
      value: amountInSatoshi
    }
  ], 1)

  if (!inputs || !outputs) throw new Error("Unable to construct transactions")
  if (fee > amountInSatoshi) throw new Error("Fee is too high")


  const psbt = new Psbt({ network: NETWORK })
  psbt.setVersion(2) // Default value is 2
  psbt.setLocktime(0) // Default value is 0

  inputs.forEach((input: any) => {
    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      sequence: 0xfffffffd, // enable RBF
      witnessUtxo: {
        value: input.value,
        script: input.address.output,
      },
      bip32Derivation: input.bip32Derivation
    })
  })

  outputs.forEach((output: any) => {
    if (!output.address) {
      output.address = changeAddress.address
    }

    psbt.addOutput({
      address: output.address,
      value: output.value
    })
  })

  return psbt
}

export const createWallet = async () => {


  const path = `m/49'/1'/0'/0`

  let mnemonic = await getNewMnemonic()
  const seed = await mnemonicToSeed(mnemonic)
  let root: BIP32Interface = fromSeed(seed, NETWORK)



  let account = root.derivePath(path)
  let node = account.derive(0).derive(0)

  let { address: btcAddress } = payments.p2pkh({
    pubkey: node.publicKey,
    network: NETWORK,
  })



  return {
    pubKey: node.publicKey,
    privKey: node.privateKey,
    address: btcAddress,
    key: node.toWIF(),
    mnemonic,
  }


}

export const getAddress = async (arrg: any) => { }