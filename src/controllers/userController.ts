import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class UserController {
  // eslint-disable-next-line class-methods-use-this
  public async registerUser(
    request: Request,
    response: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = request.body;
    let user = null;
    // See if user exists
    try {
      user = await User.findOne({ email }).exec();

      if (user) {
        return response.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }

      // Generate avatar
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      // Encrypt password
      const saltRounds = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt
        .hash(password, saltRounds)
        .then((hash) => hash);

      user = new User({
        name,
        email,
        password: passwordHash,
        avatar,
      });

      await user.save();

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: 60 * 60 * 24,
      });

      return response.status(200).json({
        success: true,
        token,
        message: 'Register success',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return response.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  }
}

export default UserController;
