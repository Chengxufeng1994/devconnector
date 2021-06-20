import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Profile, { TProfileFields, TSocialFields } from '../models/Profile';
import User from '../models/User';

class ProfileController {
  public async getProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
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

  public async getProfileByUserId(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId } = request.params;

    try {
      const profile = await Profile.findOne({ user: userId }).populate('user', [
        'name',
        'avatar',
      ]);

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      return response.status(200).send({
        success: true,
        message: 'Get profile by userId Success',
        profile,
      });
    } catch (error) {
      // console.log(error.message);
      // console.log(error.stack);
      if (error.kind === 'ObjectId') {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      return next(error);
    }
  }

  public async postProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
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

      return response.status(200).json({
        success: true,
        profile,
        message: `${hasProfile ? 'Update' : 'Create'} profile success`,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getAllProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    try {
      const profiles = await Profile.find().populate('user', [
        'name',
        'avatar',
      ]);

      return response.status(200).json({
        success: true,
        message: 'Get all profiles success',
        profiles,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId } = request;

    try {
      await Profile.findOneAndRemove({ user: userId });

      await User.findByIdAndRemove(userId);

      return response.status(200).json({
        success: true,
        message: 'Delete profiles success',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProfileController;
