const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnvVars = [
  'MONGO_URI', 
  'PORT',     
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  port: parseInt(process.env.PORT, 10) || 3000, 
};