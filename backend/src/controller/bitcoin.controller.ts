import { Request, Response, } from "express";
import { createWallet, deriveChildPublicKey, getAddressFromChildPubKey, getMasterPrivateKey, getXpubFromPrivateKey } from "../service/bitcoin.service";
import { getAddress, getWallet } from "../service/user.service";

export async function generateWalletHandler(req: any, res: Response) {
  try {

    const wallet = await createWallet()

    return res.status(201).json({ wallet })
  } catch (error) {
    console.log(error);

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

export async function bitTests(req: any, res: Response) {
  try {
    const response = getAddressFromChildPubKey("")


    return res.status(201).json(response)
  } catch (error) {
    console.log(error);

  }
}

export async function getBitcoinBalance(req: any, res: Response) {
  try {
    console.log(req.user);

  }
  catch (err) {
    throw err
  }
}