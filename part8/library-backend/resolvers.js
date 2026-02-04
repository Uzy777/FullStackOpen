const { GraphQLError } = require("graphql");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();
const BOOK_ADDED = "BOOK_ADDED";

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            const filter = {};

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
            const authors = await Author.aggregate([
                {
                    $lookup: {
                        from: "books",
                        localField: "_id",
                        foreignField: "author",
                        as: "books",
                    },
                },
                {
                    $addFields: {
                        bookCount: { $size: "$books" },
                    },
                },
                {
                    $project: {
                        books: 0,
                    },
                },
            ]);

            return authors;
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
                const populatedBook = await book.populate("author");

                pubsub.publish(BOOK_ADDED, {
                    bookAdded: populatedBook,
                });

                return populatedBook;
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

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator([BOOK_ADDED]),
        },
    },
};

module.exports = resolvers;
