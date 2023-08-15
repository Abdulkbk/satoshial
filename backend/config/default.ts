import "dotenv/config"

export default {
  port: process.env.port,
  keyName: process.env.SECRET_KEY,
  salt: process.env.SALT,
  accessTokenPrivateKey: process.env.SECRET_KEY,
  accessTokenPublicKey: process.env.SECRET_KEY,
}

