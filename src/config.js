export const Framework = require("@superfluid-finance/sdk-core");
export const ethers = require("ethers");

// Ethers.js provider initialization
export const url =
  "https://eth-ropsten.alchemyapi.io/v2/N64edKRjtKBh1aRjHU-rPbG3WagFQB-x";
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
