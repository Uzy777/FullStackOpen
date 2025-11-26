const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

// usersRouter.post("/", async (request, response) => {
//     const { username, name, password } = request.body;

//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     const user = new User({
//         username,
//         name,
//         passwordHash,
//     });

//     const savedUser = await user.save();

//     response.status(201).json(savedUser);
// });

usersRouter.post("/", async (request, response) => {
    const { username, password, name } = request.body;

    // username must be >= 3 characters
    if (!username || username.length < 3) {
        return response.status(400).json({
            error: "username must be at least 3 characters long",
        });
    }

    // password must be >= 3 characters
    if (!password || password.length < 3) {
        return response.status(400).json({
            error: "password must be at least 3 characters long",
        });
    }

    // username must be unique
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({
            error: "username must be unique",
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    return response.status(201).json(savedUser);
});

module.exports = usersRouter;
