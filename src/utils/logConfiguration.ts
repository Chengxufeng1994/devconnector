import { format, transports } from 'winston';

const { combine, timestamp, printf /* prettyPrint */ } = format;

const myFormat = printf(
  ({ level, message, timestamp: formatTimestamp }) =>
    `${level}: [${formatTimestamp}] ${message}`,
);

const logConfiguration = {
  format: combine(timestamp(), myFormat),
  level: 'info',
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
};

export default logConfiguration;
