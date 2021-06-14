import { Request, Response } from 'express';

class InitController {
  // eslint-disable-next-line class-methods-use-this
  public getInit(_req: Request, res: Response): Response {
    return res.status(200).send('Welcome dev-connector API');
  }
}

export default InitController;
