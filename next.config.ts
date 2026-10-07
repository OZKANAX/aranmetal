import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Admin panelinden görsel yükleme (dosya başına 5 MB, form başına birden çok görsel)
    serverActions: { bodySizeLimit: "12mb" },
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;
