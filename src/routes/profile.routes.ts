import Route from './routes.abstract';
import ProfileController from '../controllers/profileController';
import isAuthenticate from '../middleware/isAuthenticate';

class ProfileRoutes extends Route {
  private profileController: ProfileController = new ProfileController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get(
      '/profile',
      isAuthenticate,
      this.profileController.getProfile,
    );
  }
}

export default ProfileRoutes;
