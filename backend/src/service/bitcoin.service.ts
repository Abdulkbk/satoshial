// const bitcoin = require('bitcoinjs-lib')
import { Psbt, networks, payments, address, Transaction } from 'bitcoinjs-lib';
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Address, BlockstreamAPIUtxoResponse, DecoratedUtxo, SignedTransactionData } from '../types/bitcoin';
const coinselect = require('coinselect')
import config from 'config'
import { Axios, sumUtxoValues } from '../utils/helper';
import { getAddress, getWallet } from './user.service';
import { getTransactionHex, getUtxosFromAddress } from '../utils/blockstream-api';
import { ECPairFactory } from 'ecpair'
import log from '../utils/logger';


const { fromSeed, fromBase58 } = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc)

export const NETWORK = networks.testnet

const validator = (
  pubkey: Buffer,
  msghash: Buffer,
  signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

// export const getUnspentUtxo = async () => {
//   try {
//     const response = await Axios("getbalance")
//     // console.log(response);
//     return response

//   } catch (error) {
//     throw error
//   }
// }


// tb1qsw4rhvs7rxptv6vpa05w3tsw8apghq09unk90u  Prev addr
// send back -> mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB, tb1qt0lenzqp8ay0ryehj7m3wwuds240mzhgdhqp4c

export const generateNewMnemonic = async (strength: number = 256): Promise<string> => {
  const mnemonic = generateMnemonic(256)
  return mnemonic
}

/// Generate P2PKH address and P2WPKH
export const getAddressFromChildPubkey = (
  child: BIP32Interface, type: string | unknown = 'p2pkh'
): payments.Payment => {
  let address: payments.Payment;

  if (type === 'p2wpkh') {
    address = payments.p2wpkh({
      pubkey: child.publicKey,
      network: networks.testnet,
    });

    return address;
  }
  address = payments.p2pkh({
    pubkey: child.publicKey,
    network: networks.testnet,
  });

  return address;
};

export const getMasterPrivateKey = async (mnemonic: string): Promise<BIP32Interface> => {
  const seed = await mnemonicToSeed(mnemonic)
  const privateKey = fromSeed(seed, NETWORK)
  return privateKey
}

export const getXpubFromPrivateKey = (privateKey: BIP32Interface, derivationPath: string): string => {
  const child = privateKey.derivePath(derivationPath).neutered()

  const xpub = child.toBase58()

  return xpub
}

export const deriveChildPublicKey = (xpub: string, derivationPath: string): BIP32Interface => {
  const node = fromBase58(xpub, NETWORK)

  const child = node.derivePath(derivationPath)

  return child
}


export const createTransaction = async (
  utxos: DecoratedUtxo[],
  recipientAddress: string,
  amountInSatoshis: number,
  changeAddress: Address,
  type: string | unknown
) => {

  // Implement dynamic fee rate 
  // const feeRate = await getFeeRates();
  log.info("creating transaction")
  const { inputs, outputs, fee } = coinselect(
    utxos,
    [
      {
        address: recipientAddress,
        value: amountInSatoshis,
      },
    ],
    1
  );

  console.log('inputs', inputs);
  console.log('outputs', outputs);



  if (!inputs || !outputs) throw new Error("Unable to construct transaction");
  if (fee > amountInSatoshis) throw new Error("Fee is too high!");

  const psbt = new Psbt({ network: networks.testnet });

  psbt.setVersion(2); // These are defaults. This line is not needed.
  psbt.setLocktime(0); // These are defaults. This line is not needed.

  // If it's a P2WPKH 
  if (type === 'p2wpkh') {
    for (let input of inputs) {
      log.info(input, "inputs")
      psbt.addInput({
        hash: input.txid,
        index: input.vout,
        sequence: 0xfffffffd, // enables RBF
        witnessUtxo: {
          value: input.value,
          script: input.address.output!,
        },
        bip32Derivation: input.bip32Derivation,
      });
    };

    outputs.forEach((output: any) => {
      // coinselect doesnt apply address to change output, so add it here
      if (!output.address) {
        output.address = changeAddress.address!;
      }

      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });

    return psbt;
  }

  for (let input of inputs) {
    const txHex = await getTransactionHex(input.txid);

    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      sequence: 0xfffffffd, // enables RBF
      nonWitnessUtxo: Buffer.from(txHex, 'hex'),
      bip32Derivation: input.bip32Derivation,
    });
  };

  outputs.forEach((output: any) => {
    // coinselect doesnt apply address to change output, so add it here
    if (!output.address) {
      output.address = changeAddress.address!;
    }

    psbt.addOutput({
      address: output.address,
      value: output.value,
    });
  });

  return psbt;
};



export const getUserBalance = async (userId: any) => {
  try {
    const wallet = await getWallet(userId)

    let address
    let utxos
    let balance

    // if (wallet) {
    //   address = await getAddress(wallet?.id)
    // }

    // if (address) {
    //   utxos = await getUtxosFromAddress(address)
    // }

    // if (utxos) {
    //   balance = sumUtxoValues(utxos)
    // }

    return balance

  } catch (error) {
    throw error
  }
}


export const createDecoratedUTXOs = async (addresses: Address[], root: BIP32Interface): Promise<DecoratedUtxo[]> => {
  const deocratedUtxos: DecoratedUtxo[] = [];

  for (let address of addresses) {
    const utxos = await getUtxosFromAddress(address);


    for (let utxo of utxos) {
      deocratedUtxos.push({
        ...utxo,
        address: address,
        bip32Derivation: [
          {
            pubkey: address.pubkey!,
            path: `m/84'/0'/0'/${address.derivationPath}`,
            masterFingerprint: root.fingerprint,
          },
        ],
      });
    }
  }

  return deocratedUtxos;
};

export const createAddressBatch = (xpub: string, root: BIP32Interface, adType: string | unknown): Address[] => {
  const addressBatch: Address[] = [];

  for (let i = 0; i < 10; i++) {
    const derivationPath = `0/${i}`;
    const currentChildPubkey = deriveChildPublicKey(xpub, derivationPath);
    const currentAddress = getAddressFromChildPubkey(currentChildPubkey, adType);

    addressBatch.push({
      ...currentAddress,
      derivationPath,
      masterFingerprint: root.fingerprint,
    });
  }

  return addressBatch;
};

export const changeAddressBatch = (xpub: string, root: BIP32Interface, adType: string | unknown): Address[] => {
  const addressBatch: Address[] = [];

  for (let i = 0; i < 10; i++) {
    const derivationPath = `1/${i}`;
    const currentChildPubkey = deriveChildPublicKey(xpub, derivationPath);
    const currentAddress = getAddressFromChildPubkey(currentChildPubkey, adType);

    addressBatch.push({
      ...currentAddress,
      derivationPath,
      masterFingerprint: root.fingerprint,
    });
  }

  return addressBatch;
};


export const signTransaction = async (
  psbt: Psbt,
  node: BIP32Interface
): Promise<SignedTransactionData> => {

  await psbt.signAllInputsHD(node);
  await psbt.validateSignaturesOfAllInputs(validator);
  await psbt.finalizeAllInputs();

  const tx: Transaction = psbt.extractTransaction();

  const data: SignedTransactionData = {
    txHex: tx.toHex(),
    txId: tx.getId()
  }

  return data;
};
