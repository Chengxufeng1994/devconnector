import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import InitRoutes from './routes/init.routes';
import Route from './routes/routes.abstract';

class App {
  public app: Application;
  public host: string;
  public port: number;

  constructor(host: string, port: number, router: Route[]) {
    this.app = express();
    this.host = host;
    this.port = port;

    this.connectToTheDatabase();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.routerSetup(router);
  }

  private connectToTheDatabase() {
    const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_PATH}`;
    mongoose
      .connect(MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        // tslint:disable-next-line:no-console
        console.log('MongoDB connection success');
      })
      .catch((error) => {
        // tslint:disable-next-line:no-console
        console.error('MongoDB connection error: ', error.message);
        // Exit process with failure
        process.exit(1);
      });
  }

  private initializeMiddleware() {
    this.app.use(morgan('combined'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(helmet());
  }

  private initializeRoutes() {
    this.app.use('/', new InitRoutes().getRouter());
  }

  private routerSetup(router: Route[]) {
    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouter());
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(`App listening on http://${this.host}:${this.port}`);
    });
  }
}

export default App;
