import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(createUserDto: Prisma.UserCreateInput) {
  return await prisma.user.create({ data: createUserDto })
}

export async function updateUser(id: string, updateUserDto: any) {
  const user = await prisma.user.update({ where: { id }, data: updateUserDto })

}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
}

export async function findUserById(id: string) {
  return await prisma.user.findFirst({ where: { id } })
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } })
}

export async function findUserByUsername(username: string) {
  return await prisma.user.findFirst({ where: { username } })
}


export async function createUserWallet(data: { userId: string, privateKey: string, publicKey: string, mnemonics: string }) {
  try {
    return await prisma.wallet.create({ data })
  } catch (error) {
    throw error
  }
}

export async function createAddress(data: { address: string, walletId: string }) {
  try {
    return await prisma.publicAddress.create({ data })
  } catch (error) {
    throw error
  }
}
