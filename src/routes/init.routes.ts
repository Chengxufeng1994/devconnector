import express, { Router } from 'express';
import InitController from '../controllers/initController';

class InitRoutes {
  private router: Router;
  private initController: InitController = new InitController();

  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private setRoutes() {
    this.router.get('/', this.initController.getInit);
  }
}

export default InitRoutes;
