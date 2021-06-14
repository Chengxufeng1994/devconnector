import { check } from 'express-validator';

import Route from './routes.abstract';
import UserController from '../controllers/userController';

class UserRoutes extends Route {
  private userController: UserController = new UserController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    /**
     * @route api/users
     * @description register user
     */
    this.router.post(
      '/users',
      check('name').not().isEmpty().trim()
        .withMessage('Name is required.'),
      check('email', 'Please include a valid email.')
        .isEmail()
        .normalizeEmail(),
      check('password')
        .isLength({ min: 6 })
        .withMessage('Please enter a password with 6 or more character'),
      this.userController.registerUser,
    );
  }
}

export default UserRoutes;
