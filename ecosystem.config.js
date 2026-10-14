module.exports = {
  apps: [
    {
      name: 'agribandhu-api',
      cwd: './apps/api',
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'src/server.ts',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        JWT_SECRET: 'agribandhu-dev-super-secret-key-987654321',
      },
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'agribandhu-web',
      cwd: './apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'agribandhu-mobile',
      cwd: './apps/mobile',
      script: 'node_modules/expo/bin/cli.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      restart_delay: 3000,
    },
  ],
};
