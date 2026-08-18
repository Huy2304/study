import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/bang-xep-hang",
        destination: "/pomodoro/bang-xep-hang",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
