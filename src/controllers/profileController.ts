import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import fetch from 'node-fetch';

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

  public async addExperienceToProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId, body } = request;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, company, location, from, to, current, description } = body;
    const experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      profile.experience.unshift(experience);

      await profile.save();

      return response.status(200).json({
        success: true,
        profile,
        message: 'Add experience to profile success',
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteExperienceFromProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId, params } = request;
    const { experienceId } = params;

    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      const removeIndex = profile.experience
        // eslint-disable-next-line no-underscore-dangle
        .map((item) => item._id)
        .indexOf(experienceId);

      profile.experience.splice(removeIndex, 1);

      await profile.save();

      return response.status(200).json({
        success: true,
        profile,
        message: 'Delete experience from profile success',
      });
    } catch (error) {
      return next(error);
    }
  }

  public async addEducationToProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId, body } = request;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      body;
    const education = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      profile.education.unshift(education);

      await profile.save();

      return response.status(200).json({
        success: true,
        profile,
        message: 'Add experience to profile success',
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteEducationFromProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { userId, params } = request;
    const { educationId } = params;

    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        return response.status(400).send({
          success: false,
          message: 'There is no profile for this user',
        });
      }

      const removeIndex = profile.education
        // eslint-disable-next-line no-underscore-dangle
        .map((item) => item._id)
        .indexOf(educationId);

      profile.education.splice(removeIndex, 1);

      await profile.save();

      return response.status(200).json({
        success: true,
        profile,
        message: 'Delete experience from profile success',
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getGithubUserRepos(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | Response<unknown, Record<string, unknown>>> {
    const { params } = request;
    const { username } = params;
    try {
      // eslint-disable-next-line max-len
      const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;

      const res = await fetch(url, {
        method: 'GET',
      });
      if (res.status !== 200) {
        return response.status(404).json({
          success: false,
          message: 'No Github profile found',
        });
      }
      const result = await res.json();

      return response.status(200).json({
        success: true,
        message: 'Get Github profile success',
        result,
      });
    } catch (error) {
      // console.log(error.message);
      // console.log(error.stack);
      return next(error);
    }
  }
}

export default ProfileController;
