import { Request, Response, } from "express";
import { createWallet, deriveChildPublicKey, getAddress, getAddressFromChildPubKey, getMasterPrivateKey, getXpubFromPrivateKey } from "../service/bitcoin.service";

export async function generateWalletHandler(req: any, res: Response) {
  try {

    const wallet = await createWallet()

    return res.status(201).json({ wallet })
  } catch (error) {
    console.log(error);

  }
}

export async function generateAddressHandler(req: any, res: Response) {
  try {
    const address = await getAddress(req.body.data)


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