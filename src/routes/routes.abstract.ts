import { Router } from 'express';

abstract class Route {
  protected prefix = '/api';

  protected router = Router();

  protected abstract setRoutes(): void;

  public getPrefix(): string {
    return this.prefix;
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default Route;
