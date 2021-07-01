/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/User';
import Post from '../models/Post';

class PostController {
  public async createPost(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { userId, body } = request;
      const { text } = body;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return response.status(400).json({
          success: false,
          message: 'User not found',
        });
      }

      const newPost = new Post({
        user: userId,
        text,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();

      return response.status(200).json({
        success: true,
        message: 'Create Post success',
        post,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllPost(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    try {
      const posts = await Post.find().sort({ date: -1 });

      return response.status(200).json({
        success: true,
        message: 'Get All Posts success',
        posts,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPostById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { postId } = request.params;
    try {
      const post = await Post.findById(postId);

      if (!post) {
        return response.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      return response.status(200).json({
        success: true,
        message: 'Get Post by id success',
        post,
      });
    } catch (err) {
      const { kind } = err;
      if (kind === 'ObjectId') {
        const error: any = new Error('Post not found');
        error.code = 404;

        next(error);
      }

      next(err);
    }
  }

  public async deletePostById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId } = request;
    const { postId } = request.params;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        const error: any = new Error('Post not found');
        error.code = 404;
        throw error;
      }

      if (post.user.toString() !== userId) {
        const error: any = new Error('User not unauthorized');
        error.code = 401;
        throw error;
      }

      const result = await Post.deleteOne({ _id: postId });
      if (result.ok !== 1) {
        const error: any = new Error('Delete Post Fail');
        error.code = 404;
        throw error;
      }

      return response.status(200).json({
        success: true,
        message: 'Delete Post by id success',
      });
    } catch (err) {
      const { kind } = err;
      if (kind === 'ObjectId') {
        const error: any = new Error('Post not found');
        error.code = 404;

        next(error);
      }

      next(err);
    }
  }
}

export default PostController;
