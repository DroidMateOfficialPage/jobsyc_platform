import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},

images: {
    domains: [
      "mxiwzeapmfevwfbltcyl.supabase.co",
      "lh3.googleusercontent.com", // ako koristiš Google Auth
      "avatars.githubusercontent.com",
    ],
  },
};




export default nextConfig;
