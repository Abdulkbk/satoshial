import { Request, Response, } from "express";
import { createPost, updatePost, deletePost, likePost, getPost, getPostById } from "../service/post.service";


export async function createPostHandler(req: any, res: Response) {
  try {

    const { title, content } = req.body

    const authorId = req.user?.userId



    if (!title || !content || !authorId) {
      return res.status(400).json({ success: false, message: `Make sure to provide all details` })
    }

    const postData = { title, content, authorId }

    const createdPost = await createPost(postData)

    res.status(201).json({ success: true, message: 'Post created successfully', data: createdPost })

  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: 'Failed to create post', error })
  }
}


export async function getPostHandler(req: any, res: Response) {
  try {
    const posts = await getPost()
    res.status(200).json({ success: true, posts })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve posts', error })
  }

}


export async function getPostByIdHandler(req: any, res: Response) {
  try {
    const id = req.params.id


    const post = await getPostById(id)
    res.status(200).json({ success: true, post })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve post', error })
  }
}