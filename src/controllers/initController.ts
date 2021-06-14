import { Request, Response } from 'express';

class InitController {
  public getInit(req: Request, res: Response) {
    return res.status(200).send('Welcome dev-connector API');
  }
  public postInit(req: Request, res: Response) {
    return res.send(req.body);
  }
}

export default InitController;
