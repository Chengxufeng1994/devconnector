import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import InitRoutes from './routes/initRoutes';

class App {
  public app: Application;
  public host: string;
  public port: number;

  constructor(host: string, port: number) {
    this.app = express();
    this.host = host;
    this.port = port;

    this.initializeMiddleware();
    this.initializeRoutes();
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

  public listen() {
    this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(`App listening on http://${this.host}:${this.port}`);
    });
  }
}

export default App;
