const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const startServer = (port) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    startStandaloneServer(server, {
        listen: { port },

        context: async ({ req }) => {
            const auth = req.headers.authorization;

            if (auth && auth.startsWith("Bearer ")) {
                const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

                const currentUser = await User.findById(decodedToken.id);
                return { currentUser };
            }

            return { currentUser: null };
        },
    });
};

module.exports = startServer;
