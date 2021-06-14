import { Request, Response } from 'express';
import Route from './routes.abstract';

class AuthRoutes extends Route {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/auth', (request: Request, response: Response) => {
      response.send('Get Auth');
    });
  }
}

export default AuthRoutes;
