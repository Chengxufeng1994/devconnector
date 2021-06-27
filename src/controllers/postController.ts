import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/User';
import Post from '../models/Post';

class PostController {
  // eslint-disable-next-line consistent-return
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
}

export default PostController;
