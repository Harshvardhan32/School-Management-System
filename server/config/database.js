const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log('Database Connected Successfully!');
        })
        .catch((error) => {
            console.log('Database Connection Failed!');
            console.log(error.message);
            process.exit(1);
        })
}

module.exports = dbConnect;