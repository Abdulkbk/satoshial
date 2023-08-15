import { Request, Response, } from "express";
import { findUserByEmail, createUser } from "../service/user.service";
import { hash } from "../utils/helper";
import logger from "../utils/logger";

export async function signupUserHAndler(req: Request<{}, {}>, res: Response) {
  let { fullname, email, password, username } = req.body
  console.log({ fullname, email, password, username });

  try {
    const user = await findUserByEmail(email)

    if (user) {
      res.status(409).json({ success: false, message: "User already exists" })
      return
    }

    if (!fullname || !email || !password || !username) {
      res.status(400).json({ success: false, message: `Make sure to provide all details` })
      return
    }

    const userData = {
      name: fullname, email, password, username
    }

    userData.password = await hash(userData.password)
    const createdUser = await createUser(userData)

    res.status(201).json({ success: true, message: `User created successfully` })

  } catch (error) {
    res.status(500).json({ success: false, message: 'user not created' })
    console.log(error);

  }

}

