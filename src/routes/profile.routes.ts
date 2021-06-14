import { Request, Response } from 'express';
import Route from './routes.abstract';

class ProfileRoutes extends Route {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/profile', (request: Request, response: Response) => {
      response.send('Get Profile');
    });
  }
}

export default ProfileRoutes;
