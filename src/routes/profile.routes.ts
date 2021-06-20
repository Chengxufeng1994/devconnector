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
     * @route PUT api/profile/experience
     * @description Add profile experience
     * @access Private
     */
    this.router.put(
      '/profile/experience',
      isAuthenticate,
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
      this.profileController.addExperienceToProfile,
    );
    /**
     * @route Delete api/profile/experience
     * @description Delete profile experience
     * @access Private
     */
    this.router.delete(
      '/profile/experience/:experienceId',
      isAuthenticate,
      this.profileController.deleteExperienceFromProfile,
    );
    /**
     * @route PUT api/profile/education
     * @description Add profile education
     * @access Private
     */
    this.router.put(
      '/profile/education',
      isAuthenticate,
      check('degree', 'Degree is required').not().isEmpty(),
      check('school', 'School is required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
      this.profileController.addEducationToProfile,
    );
    /**
     * @route Delete api/profile/education
     * @description Delete profile education
     * @access Private
     */
    this.router.delete(
      '/profile/education/:educationId',
      isAuthenticate,
      this.profileController.deleteEducationFromProfile,
    );
    /**
     * @route Get api/profile/all
     * @description Get All Profile
     * @access Private
     */
    this.router.get('/profile/all', this.profileController.getAllProfile);
    /**
     * @route Delete api/profile
     * @description Delete Profile
     * @access Private
     */
    this.router.delete(
      '/profile',
      isAuthenticate,
      this.profileController.deleteProfile,
    );
  }
}

export default ProfileRoutes;
