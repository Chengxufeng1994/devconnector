import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Profile, { TProfileFields, TSocialFields } from '../models/Profile';

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

  public async postProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { userId, body } = request;
    const {
      facebook,
      instagram,
      linkedin,
      twitter,
      youtube,
      ...restRequestBody
    } = body;

    const profileFields: TProfileFields = {
      user: userId as string,
    };

    const requestBodyKeys = Object.keys(restRequestBody);
    requestBodyKeys.forEach((key) => {
      const value = restRequestBody[key];
      profileFields[key] = value;
    });

    const social: TSocialFields = {};
    if (facebook) {
      social.facebook = facebook;
    }
    if (instagram) {
      social.instagram = instagram;
    }
    if (linkedin) {
      social.linkedin = linkedin;
    }
    if (twitter) {
      social.twitter = twitter;
    }
    if (youtube) {
      social.youtube = youtube;
    }

    profileFields.social = social;

    let profile = null;
    let hasProfile = false;
    try {
      console.log(userId);
      profile = await Profile.findOne({ user: userId });

      if (profile) {
        hasProfile = true;
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: profileFields },
          { new: true },
        );
      } else {
        // Create
        profile = new Profile(profileFields);
        await profile.save();
      }

      console.log('[profile]: ', profile);

      return response.status(200).json({
        success: true,
        profile,
        message: `${hasProfile ? 'Update' : 'Create'} profile success`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProfileController;
