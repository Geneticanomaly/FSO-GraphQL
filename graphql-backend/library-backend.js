const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    me: User
    allUsers: [User!]!
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ) : Book,
    editAuthor(
        name: String!
        setBornTo: Int!
     ) : Author,
    createUser(
        username: String!
        favoriteGenre: String!
    ) : User,
    login(
        username: String!
        password: String!
    ) : Token
  }
`;

const resolvers = {
    Query: {
        bookCount: async () => {
            const books = await Book.find({});
            return books.length;
        },
        allBooks: async (root, args) => {
            let books = await Book.find({}).populate('author');

            if (args.author) {
                books = books.filter((book) => book.author === args.author);
            }
            if (args.genre) {
                books = books.filter((book) => book.genres.includes(args.genre));
            }

            return books;
        },
        authorCount: async () => {
            const authors = await Author.find({});
            return authors.length;
        },
        allAuthors: async () => {
            const authors = await Author.find({});
            return authors;
        },
        allUsers: async () => {
            const users = await User.find({});
            return users;
        },
        me: async (root, args, context) => {
            return context.currentUser;
        },
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }

            let author = await Author.findOne({ name: args.author });

            if (!author) {
                author = new Author({ name: args.author });
                try {
                    await author.save();
                } catch (error) {
                    throw new GraphQLError('Saving author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error,
                        },
                    });
                }
            }

            const book = new Book({
                title: args.title,
                published: args.published,
                author: author._id,
                genres: args.genres,
            });

            try {
                await book.save();
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error,
                    },
                });
            }

            return book.populate('author');
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser;

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }

            const updatedData = {
                born: args.setBornTo,
            };

            const updatedAuthor = await Author.findOneAndUpdate({ name: args.name }, updatedData, {
                new: true,
            });

            if (!updatedAuthor) return null;

            return updatedAuthor;
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
            return user.save().catch((error) => {
                throw new GraphQLError('Creating the user failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.username,
                        error,
                    },
                });
            });
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('incorrect credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
            const userToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(userToken, process.env.SECRET) };
        },
    },
    Author: {
        bookCount: async (root) => {
            const bookAmount = await Book.countDocuments({ author: root.id });
            return bookAmount;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer')) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
