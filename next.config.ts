import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: "/t/demo-amss",
        destination: "/t/casa-limon",
        permanent: false,
      },
      {
        source: "/t/demo-amss/:path*",
        destination: "/t/casa-limon/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
