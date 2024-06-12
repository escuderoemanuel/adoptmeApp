const dotenv = require('dotenv')
dotenv.config()

// COMMANDER
const { Command } = require('commander');
const program = new Command();

program.parse(process.argv);

module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    TESTING_URL: process.env.TESTING_URL
}
