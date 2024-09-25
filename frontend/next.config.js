module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "shippingroutes.blob.core.windows.net",
        port: "",
        pathname: "/fileupload/**",
      },
    ],
  },
};
