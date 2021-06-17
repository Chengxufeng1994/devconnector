module.exports = {
  apps: [
    {
      name: 'dev-connector-api',
      script: 'src/server.ts',
      watch: true,
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
