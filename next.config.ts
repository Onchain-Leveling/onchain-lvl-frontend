import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { 
            key: 'Content-Type', 
            value: 'application/json; charset=utf-8' 
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          },
        ],
      },
      {
        source: '/farcaster.json',
        headers: [
          { 
            key: 'Content-Type', 
            value: 'application/json; charset=utf-8' 
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          },
        ],
      },
      {
        source: '/ImagesLogo',
        headers: [
          { 
            key: 'Content-Type', 
            value: 'image/png' 
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          },
        ],
      },
    ];
  },
};
