/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // compiler : {
  //   // Enables the styled-components SWC transform
  //   styledComponents: true
  // }
}

const webpack = require('webpack');
const {parsed : myEnv} = require('dotenv').config();

// module.exports = nextConfig
module.exports = {
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
  nextConfig  

}
