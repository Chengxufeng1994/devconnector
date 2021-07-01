import { Request, Response } from 'express';
import { check } from 'express-validator';

import Route from './routes.abstract';
import PostController from '../controllers/postController';
import isAuthenticate from '../middleware/isAuthenticate';

class PostsRoutes extends Route {
  private postController: PostController = new PostController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/posts', (request: Request, response: Response) => {
      response.send('Get Posts');
    });
    /**
     * @route POST api/posts
     * @description Create a post
     * @access Private
     */
    this.router.post(
      '/posts',
      [isAuthenticate, check('text', 'Text is required').not().isEmpty()],
      this.postController.createPost,
    );

    /**
     * @route GET api/posts
     * @description Get all post
     * @access Private
     */
    this.router.get(
      '/posts/all',
      isAuthenticate,
      this.postController.getAllPost,
    );
    /**
     * @route GET api/posts/:postId
     * @description Get post by id
     * @access Private
     */
    this.router.get(
      '/posts/:postId',
      isAuthenticate,
      this.postController.getPostById,
    );
    /**
     * @route DELETE api/posts/:postId
     * @description Delete post by id
     * @access Private
     */
    this.router.delete(
      '/posts/:postId',
      isAuthenticate,
      this.postController.deletePostById,
    );
  }
}

export default PostsRoutes;
