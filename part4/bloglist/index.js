require("dotenv").config();

const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const express = require("express");
const mongoose = require("mongoose");

// const app = express();

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});

// const Blog = mongoose.model("Blog", blogSchema);

// const password = process.argv[2];

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

app.use(express.json());

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
