import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()


export async function createPost(data: { title: string, content: string, authorId: string }) {
  return await prisma.post.create({ data })
}

export async function updatePost(data: Prisma.PostCreateInput) {

}

export async function deletePost(data: Prisma.PostCreateInput) {

}

export async function likePost(data: Prisma.PostCreateInput) {

}