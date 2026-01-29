const { GraphQLError } = require("graphql");
const { v1: uuid } = require("uuid");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const jwt = require("jsonwebtoken");

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            let filter = {};

            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                if (!author) return [];
                filter.author = author._id;
            }

            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }

            return Book.find(filter).populate("author");
        },

        allAuthors: async () => {
            return Author.find({});
        },

        me: (root, args, context) => {
            return context.currentUser;
        },
    },

    Author: {
        bookCount: async (root) => {
            return Book.countDocuments({ author: root._id });
        },
    },

    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError("not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            try {
                let author = await Author.findOne({ name: args.author });

                if (!author) {
                    author = new Author({ name: args.author });
                    await author.save();
                }

                const book = new Book({
                    title: args.title,
                    published: args.published,
                    genres: args.genres,
                    author: author._id,
                });

                await book.save();
                return book.populate("author");
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                    },
                });
            }
        },

        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError("not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            const author = await Author.findOne({ name: args.name });
            if (!author) return null;

            try {
                author.born = args.setBornTo;
                await author.save();
                return author;
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                    },
                });
            }
        },

        createUser: async (root, args) => {
            try {
                const user = new User({
                    username: args.username,
                    favoriteGenre: args.favoriteGenre,
                });

                return await user.save();
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                    },
                });
            }
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== "secret") {
                throw new GraphQLError("wrong credentials", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            return {
                value: jwt.sign(userForToken, process.env.JWT_SECRET),
            };
        },
    },
};

module.exports = resolvers;
