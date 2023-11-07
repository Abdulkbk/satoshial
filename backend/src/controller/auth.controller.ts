import { Request, Response, } from "express";
import { findUserByEmail, createUser, createUserWallet, createAddress } from "../service/user.service";
import { hash, comparePw } from "../utils/helper";
import logger from "../utils/logger";
import { signJwt } from "../utils/jwt";
import { getAddressFromChildPubKey, getMasterPrivateKey, getNewMnemonic, getXpubFromPrivateKey } from "../service/bitcoin.service";

export async function signupUserHandler(req: Request<{}, {}>, res: Response) {
  try {
    let { fullname, email, password, username } = req.body
    console.log({ fullname, email, password, username });

    const user = await findUserByEmail(email)

    if (user) {
      return res.status(409).json({ success: false, message: "User already exists" })

    }

    if (!fullname || !email || !password || !username) {
      return res.status(400).json({ success: false, message: `Make sure to provide all details` })

    }

    const userData = {
      name: fullname, email, password, username
    }

    userData.password = await hash(userData.password)
    const createdUser = await createUser(userData)

    const derivePath = "m/0"

    const mnemonics = await getNewMnemonic()

    const privateKey = await getMasterPrivateKey(mnemonics)

    const publicKey = getXpubFromPrivateKey(privateKey, derivePath)

    const wallet = await createUserWallet({ userId: createdUser.id, publicKey, privateKey, mnemonics })

    const address = getAddressFromChildPubKey(publicKey)

    if (address.address) {
      createAddress({ address: address.address, walletId: wallet.id })

    }


    res.status(201).json({ success: true, message: `User created successfully` })

  } catch (error) {
    res.status(500).json({ success: false, message: 'user not created', error })
    console.log(error);

  }

}


export async function signinUserHandler(req: Request<{}, {}>, res: Response) {

  try {
    let { email, password } = req.body

    const user = await findUserByEmail(email)

    if (!user) {
      res.status(404).json({ success: false, message: "User does not exists" })
      return
    }

    const isPasswordMatch = await comparePw(password, user.password)

    if (!isPasswordMatch) {
      return res.status(403).json({ success: false, message: "Incorrect password" })
    }

    const token = signJwt({ userId: user.id, username: user.username }, 'accessTokenPrivateKey')

    res.status(200).json({ success: true, message: 'Sign in successful', token })

  } catch (error) {

    console.log(error);
    return res.status(500).json({ succcess: false, message: 'Sign in failed', error })


  }

}

