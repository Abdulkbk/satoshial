import axios from 'axios'
import { Address, BlockstreamAPITransactionResponse, BlockstreamAPIUtxoResponse } from '../types/bitcoin'
import config from 'config'

const BASE_URL = config.get<number>("bitcoin_url")

export const getTransactionFromAddress = async (address: Address): Promise<BlockstreamAPITransactionResponse[]> => {
  const { data } = await axios.get(`${BASE_URL}/address/${address.address}/txz`)
  return data
}

export const getBalanceFromAddress = async (address: Address): Promise<{}> => {
  return ''
}

export const getUtxosFromAddress = async (address: Address): Promise<BlockstreamAPIUtxoResponse[]> => {
  const { data }: { data: BlockstreamAPIUtxoResponse[] } = await axios.get(`${BASE_URL}/address/${address.address}/utxo`)

  return data
}

export const getTransactionHex = async (txid: string): Promise<string> => {
  const { data } = await axios.get(
    `${BASE_URL}/tx/${txid}/hex`
  );

  return data;
};

export const getFeeRates = async () => {
  throw new Error('Not implemented yet')
}

export const broadcastTx = async (txHex: string): Promise<string> => {
  const { data } = await axios.post(`${BASE_URL}/tx`, txHex)

  return data
}
