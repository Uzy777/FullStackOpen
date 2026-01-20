const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    url: String,
    title: String,
    author: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: {
        type: Number,
        default: 0,
    },
    // id: String,
    comments: {
        type: [String],
        default: [],
    },
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Blog", blogSchema);
