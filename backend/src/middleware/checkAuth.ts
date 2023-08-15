import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'


export const bearerTokenMidlleware = async (req: any, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization

  if (!bearerToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  const parts = bearerToken.split(' ')

  if (parts[0] !== 'Bearer') {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  let decodedToken
  try {
    console.log(parts[1]);

    decodedToken = await verifyJwt(parts[1], "accessTokenPublicKey")
    // console.log(decodedToken);

  } catch (error) {
    console.log(error);

    return res.status(401).send('Unauthorized');
  }

  console.log(decodedToken);


  req.user = decodedToken.user
  next()
} 