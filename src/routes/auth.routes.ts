import { Request, Response } from 'express';
import { check } from 'express-validator';
import Route from './routes.abstract';
import AuthController from '../controllers/authController';
import isAuthenticate from '../middleware/isAuthenticate';
import User from '../models/User';

class AuthRoutes extends Route {
  private authController: AuthController = new AuthController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    /**
     * @route GET api/auth
     * @description
     */
    this.router.get(
      '/auth',
      isAuthenticate,
      async (request: Request, response: Response) => {
        try {
          const { userId } = request;
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
      },
    );
    /**
     * @route POST api/auth
     * @description Authenticate user & get token
     * @access public
     */
    this.router.post(
      '/auth',
      check('email', 'Please include a valid email.')
        .isEmail()
        .normalizeEmail(),
      check('password')
        .isLength({ min: 6 })
        .withMessage('Please enter a password with 6 or more character'),
      this.authController.login,
    );
  }
}

export default AuthRoutes;
