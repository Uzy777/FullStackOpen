const { GraphQLError } = require("graphql");
const { v1: uuid } = require("uuid");
const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: async (root, args) => {
            let filter = {};

            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                if (!author) {
                    return [];
                }
                filter.author = author._id;
            }

            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }

            return Book.find(filter).populate("author");
        },
    },

    Mutation: {
        addBook: async (root, args) => {
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
        },

        editAuthor: (root, args) => {
            const author = authors.find((a) => a.name === args.name);

            if (!author) {
                return null;
            }

            author.born = args.setBornTo;
            return author;
        },
    },
};

module.exports = resolvers;
