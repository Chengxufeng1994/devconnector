import { Request, Response } from 'express';
import Route from './routes.abstract';

class UserRoutes extends Route {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/users', (request: Request, response: Response) => {
      response.send('Get Users');
    });
  }
}

export default UserRoutes;
