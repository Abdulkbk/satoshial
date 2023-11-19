import axios from 'axios'
import bcrypt from 'bcryptjs'
import config from 'config'
import { BlockstreamAPIUtxoResponse } from '../types/bitcoin'

const BASE_URL = config.get<number>("bitcoin_url")

const bitcoin_port = config.get<number>("signet_port")
const user = config.get<string>("rpc_user")
const password = config.get<string>("rpc_password")

const rpc_url = `http://127.0.0.1:${bitcoin_port}`

export const Axios = async (method: string, parameter = []) => {
  const body = {
    jsonrpc: "1.0",
    id: "curltext",
    method,
    parameter: parameter
  }
  // console.log('Sending to btc');

  // console.log(user);
  // console.log(password);
  // console.log(bitcoin_port);
  // console.log(method);




  try {
    const response = await axios.post(rpc_url, JSON.stringify(body), {
      auth: {
        username: user,
        password: password
      }
    })

    // console.log('done');
    // console.log(response.data);



    return response.data
  } catch (error) {
    console.log(error);

    throw error
  }
}

export async function hash(password: string) {
  const SALT = config.get<number>("salt")
  console.log(SALT);

  const salt = await bcrypt.genSalt(+SALT)

  const hash_pw = await bcrypt.hash(password, salt)
  return hash_pw
}


export async function comparePw(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export function satoshiToBitcoin(satoshi: number): number {
  return satoshi / 100000000;
}

export function sumUtxoValues(utxos: BlockstreamAPIUtxoResponse[]): number {
  return utxos.reduce((sum, utxo) => sum + utxo.value, 0);
}


