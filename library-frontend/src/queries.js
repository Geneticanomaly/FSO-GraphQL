import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        id
        title
        author {
            name
        }
        published
        genres
    }
`;

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            author {
                name
            }
            published
            genres
        }
    }
`;

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            author {
                name
            }
        }
    }
`;

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`;

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`;

export const BOOKS_BY_GENRE = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`;

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;
