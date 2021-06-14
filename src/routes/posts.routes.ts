import { Request, Response } from 'express';
import Route from './routes.abstract';

class PostsRoutes extends Route {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/posts', (request: Request, response: Response) => {
      response.send('Get Posts');
    });
  }
}

export default PostsRoutes;
