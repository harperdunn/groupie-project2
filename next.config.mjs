/** @type {import('next').NextConfig} */
export default {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login', // Replace '/yourCustomHomePage' with the path you want as your home page
          permanent: true,
        },
      ];
    },
  };