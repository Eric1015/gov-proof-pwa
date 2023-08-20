/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/ipfs/**",
      }
    ]
  }
}

module.exports = withPWA(nextConfig);
