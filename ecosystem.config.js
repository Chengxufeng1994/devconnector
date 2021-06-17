module.exports = {
  apps: [
    {
      name: 'dev-connector-api',
      script: 'src/server.ts',
      watch: true,
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      //combine multiple err/out logs in one file for each
      combine_logs: true,
      //calls combine logs
      merge_logs: true,
      //error log file path
      error_file: 'logs/err.log', // better be /var/log
      //out log file path
      out_file: 'logs/out.log',
      // use time in logs
      time: true,
    },
  ],
};
