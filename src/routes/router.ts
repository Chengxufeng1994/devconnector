// src/routes/router.ts
import Route from './routes.abstract';
import AuthRoutes from './auth.routes';
import UserRoutes from './users.routes';
import PostsRoutes from './posts.routes';
import ProfileRoutes from './profile.routes';

const router: Route[] = [
  new AuthRoutes(),
  new UserRoutes(),
  new PostsRoutes(),
  new ProfileRoutes(),
];

export default router;
