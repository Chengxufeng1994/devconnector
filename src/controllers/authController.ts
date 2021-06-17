import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class AuthController {
  // eslint-disable-next-line class-methods-use-this
  public async login(request: Request, response: Response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return response.status(400).json({
          success: false,
          message: 'Invalid Credentials',
        });
      }

      // Encrypt password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({
          success: false,
          message: 'Invalid Credentials',
        });
      }

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: 60 * 60 * 24,
      });

      return response.status(200).json({
        success: true,
        token,
        message: 'Login success',
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

export default AuthController;
