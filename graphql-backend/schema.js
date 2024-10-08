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

  type Subscription {
    bookAdded: Book!
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

module.exports = typeDefs;
