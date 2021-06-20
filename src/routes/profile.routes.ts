import { check } from 'express-validator';

import Route from './routes.abstract';
import ProfileController from '../controllers/profileController';
import isAuthenticate from '../middleware/isAuthenticate';

class ProfileRoutes extends Route {
  private profileController: ProfileController = new ProfileController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    /**
     * @route GET api/profile
     * @description Get current users profile
     * @access Private
     */
    this.router.get(
      '/profile',
      isAuthenticate,
      this.profileController.getProfile,
    );
    /**
     * @route GET api/profile/user/:userId
     * @description Get profile by userId
     * @access Private
     */
    this.router.get(
      '/profile/user/:userId',
      this.profileController.getProfileByUserId,
    );
    /**
     * @route POST api/profile
     * @description Creat or update user profile
     * @access Private
     */
    this.router.post(
      '/profile',
      [
        isAuthenticate,
        check('status', 'Status is required').not().isEmpty(),
        check('skills').isArray({ min: 1 }).withMessage('Skills is required'),
      ],
      this.profileController.postProfile,
    );
    /**
     * @route Get api/profile/all
     * @description Get All Profile
     * @access Private
     */
    this.router.get('/profile/all', this.profileController.getAllProfile);
  }
}

export default ProfileRoutes;
