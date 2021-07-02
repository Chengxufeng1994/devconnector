import { createLogger } from 'winston';
import logConfiguration from './logConfiguration';

const logger = createLogger(logConfiguration);

export default logger;
