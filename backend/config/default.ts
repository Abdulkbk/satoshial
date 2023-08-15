import "dotenv/config"

export default {
  port: process.env.port,
  keyName: process.env.SECRET_KEY,
  salt: process.env.SALT
}

