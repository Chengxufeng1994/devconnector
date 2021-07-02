import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import InitRoutes from './routes/init.routes';
import Route from './routes/routes.abstract';

import errorHandler from './errorHandler';

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
    this.errorHandlerSetup();
  }

  // eslint-disable-next-line class-methods-use-this
  private connectToTheDatabase() {
    // eslint-disable-next-line max-len
    const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_PATH}`;
    mongoose
      .connect(MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('MongoDB connection success');
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`MongoDB connection error: ${error.message}`);
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
    router.forEach((route) => {
      this.app.use(route.getPrefix(), route.getRouter());
    });
  }

  private errorHandlerSetup() {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on http://${this.host}:${this.port}`);
      // Here we send the ready signal to PM2
      if (process.send) {
        // eslint-disable-next-line no-console
        console.log('[PM2]: Send ready to PM2');
        process.send('ready');
      }
    });
  }
}

process.on('message', (msg) => {
  if (msg === 'shutdown') {
    console.log('Closing all connections...');
    setTimeout(() => {
      console.log('Finished closing connections');
      process.exit(0);
    }, 1500);
  }
});

export default App;
