module.exports = {
  apps: [
    {
      name: 'dev-connector-api',
      script: 'src/server.ts',
      watch: true,
      wait_ready: true,
      shutdown_with_message: true,
      listen_timeout: 3000,
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 0 * * *',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      ignore_watch: ['node_modules'],
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
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
