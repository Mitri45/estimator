# Estimator App Deployment

## Prerequisites

- Node.js (v18 or higher)
- pnpm or npm
- PM2 (will be installed automatically if not present)
- Nginx configured as shown in the Nginx config

## Quick Deployment

1. Make sure you're in the project root directory:
   ```bash
   cd /home/dima/estimator
   ```

2. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## What the script does:

1. **Installs dependencies** for root, app, and server
2. **Builds the frontend** using Vite
3. **Copies built files** to `/var/www/estimator.madeby.dev/html`
4. **Builds the server** TypeScript code
5. **Starts the server** with PM2 on port 3800

## Environment Variables

The server uses the following environment variables (set automatically by the script):
- `NODE_ENV=production`
- `SERVER_PORT=3800`
- `ORIGIN=https://estimator.madeby.dev`

If you need additional environment variables, create a `.env` file in the `server/` directory using `.env.example` as a template.

## PM2 Commands

- Check status: `pm2 list`
- View logs: `pm2 logs estimator-server`
- Restart server: `pm2 restart estimator-server`
- Stop server: `pm2 stop estimator-server`

## Manual Deployment Steps

If you prefer to deploy manually:

```bash
# Install dependencies
pnpm install

# Build frontend
cd app
pnpm install
pnpm build

# Copy to Nginx root
sudo cp -r dist/* /var/www/estimator.madeby.dev/html/

# Build and start server
cd ../server
pnpm install
pnpm build
NODE_ENV=production SERVER_PORT=3800 ORIGIN=https://estimator.madeby.dev pm2 start dist/index.js --name estimator-server
```

## URLs

- Frontend: https://estimator.madeby.dev
- WebSocket: wss://estimator-ws.madeby.dev