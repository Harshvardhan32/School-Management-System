const express = require('express');
const dbConnect = require('./config/database');
const cloudinaryConnect = require('./config/cloudinary');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started successfully at port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('<h1>This is homepage.</h1>')
});

cloudinaryConnect();
dbConnect();