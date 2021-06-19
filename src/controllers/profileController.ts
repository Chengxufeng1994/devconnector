import { NextFunction, Request, Response } from 'express';

import Profile from '../models/Profile';

class ProfileController {
  public async getProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const profile = await Profile.findOne({ user: request.userId }).populate(
        'user',
        ['name', 'avatar'],
      );

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      return response.status(200).send({
        success: true,
        message: 'Get profile Success',
        profile,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProfileController;
