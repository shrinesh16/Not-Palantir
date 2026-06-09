import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Not-Palantir/',
  server: {
    proxy: {
      '/api/opensky': {
        target: 'https://opensky-network.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opensky/, '/api'),
        secure: true,
      },
      '/api/adsblol': {
        target: 'https://api.adsb.lol',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsblol/, ''),
        secure: true,
      },
      '/api/airplaneslive': {
        target: 'https://api.airplanes.live',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/airplaneslive/, ''),
        secure: true,
      },
      '/api/fr24': {
        target: 'https://data-cloud.flightradar24.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fr24/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://www.flightradar24.com');
            proxyReq.setHeader('Referer', 'https://www.flightradar24.com/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          });
        }
      },
      '/api/digitraffic': {
        target: 'https://meri.digitraffic.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/digitraffic/, ''),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Digitraffic requires a unique user header
            proxyReq.setHeader('Digitraffic-User', 'MythrionDashboard/1.0');
          });
        }
      },
    },
  },
})
