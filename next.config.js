/** @type {import('next').NextConfig} */

const imageLocations = [
  "lh3.googleusercontent.com",
  "res.cloudinary.com",
  "www.facebook.com",
  "www.google.com",
  "www.cjdropshipping.com",
  "www.amazon.com",
  "example.com",
  "images.unsplash.com",
  "via.placeholder.com",
  "picsum.photos",
  "m.media-amazon.com",
  "images.pexels.com",
  "cdn.dribbble.com",
  "placehold.co",
  "api.dicebear.com",
  "example.com"

];
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['xml',  'tsx', 'ts'],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: imageLocations.map((location) => ({ hostname: location })),

  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/TechWithTy/DataDrivenCyberOni",
        permanent: true,
      },
      {
        source: "/support",
        destination: "https://form.jotform.com/233444925421050",
        permanent: true,
      },
      {
        source: "/schedule",
        destination: "https://calendly.com/cyberoni/quick-zoom-meeting",
        permanent: true,
      },
      {
        source: "/apply/full-stack",
        destination: "https://form.jotform.com/233470488980164",
        permanent: true,
      },
      {
        source: "/hire-a-dev",
        destination: "https://form.jotform.com/233471176876163",
        permanent: true,
      },
    
      {
        source: "/small-business-suppliment",
        destination: "https://www.jotform.com/build/240795056336158",
        permanent: true,
      },
      {
        source: "/google-business",
        destination: "https://maps.app.goo.gl/44BHLXSPYw6mNotMA",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "https://github.com/TechWithTy/CyberOniTemplate",
        permanent: true,
      },
      {
        source: "/api-docs",
        destination:
          "https://red-shadow-684768.postman.co/workspace/CyberOni~bb41df77-b3e1-42d2-b12a-3ccefc9ed4a4/collection/21592192-43d2981d-e1fc-4d81-acf8-9ed65724bbed?action=share&creator=26434854",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/CyberOnillc",
        permanent: false,
      },
      {
        source: "/facebook",
        destination: "https://www.facebook.com/softwear4u",
        permanent: false,
      },
      {
        source: "/instagram",
        destination: "https://instagram.com/softwear4u/",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/company/softwear4u/",
        permanent: false,
      },
      {
        source: "/freelancer",
        destination: "https://www.freelancer.com/u/CodingOni",
        permanent: false,
      },     
    ];
  },
  experimental: {

  }
} 

module.exports = nextConfig;
