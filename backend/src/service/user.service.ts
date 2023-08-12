import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(createUserDto: any) {
  return await prisma.user.create(createUserDto)
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

