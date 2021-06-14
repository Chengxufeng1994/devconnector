import { Request, Response } from 'express';

import Route from './routes.abstract';
import isAuthenticate from '../middleware/isAuthenticate';
import User from '../models/User';

class AuthRoutes extends Route {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get(
      '/auth',
      isAuthenticate,
      async (request: Request, response: Response) => {
        try {
          const userId = request.userId;
          const user = await User.findById(userId).select('-password');
          return response.status(200).json({
            success: true,
            user,
          });
        } catch (error) {
          return response.status(500).json({
            success: false,
            message: 'Server Error',
          });
        }
      }
    );
  }
}

export default AuthRoutes;
