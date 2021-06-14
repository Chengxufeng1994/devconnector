import path from 'path';
import dotenv from 'dotenv';
import App from './app';
import router from './routes/router';
/* Environment Variables */
dotenv.config({
  path: path.resolve(__dirname, '../', '.env'),
});

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT as string, 10) || 3000;
const app = new App(HOST, PORT, router);

app.listen();
