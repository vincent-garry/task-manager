module.exports = {
    apps: [{
      name: 'task-manager-api',
      script: 'dist/main.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false
    }]
  };