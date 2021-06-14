import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class UserController {
  public async registerUser(request: Request, response: Response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = request.body;
    // See if user exists
    await User.findOne({ email })
      .exec()
      .then(async (user) => {
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
          .then((hash) => {
            return hash;
          });
        const newUser = new User({
          name,
          email,
          password: passwordHash,
          avatar,
        });

        await newUser.save();

        const payload = {
          id: newUser.id,
        };

        const token = await jwt.sign(
          payload,
          process.env.JWT_SECRET as string,
          {
            expiresIn: 60 * 60 * 24,
          }
        );

        return response.status(200).json({
          success: true,
          token,
          message: 'Register success',
        });
      })
      .catch((error) => {
        return response.status(500).json({
          success: false,
          message: 'Server Error',
        });
      });
  }
}

export default UserController;
