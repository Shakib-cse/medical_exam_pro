import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840, 5120],
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/resources/msra-question-bank",
        destination: "/how-to-prepare/msra",
        permanent: false,
      },
      {
        source: "/resources/msra-exam-guide",
        destination: "/exam-guide/overview-1",
        permanent: false,
      },
      {
        source: "/resources/start-sample",
        destination: "/how-to-prepare/msra",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
