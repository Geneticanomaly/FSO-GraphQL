const mongoose = require('mongoose');
const Author = require('./models/Author');
const Book = require('./models/Book');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

const updateAuthorsTableToIncludeBooks = async () => {
    try {
        const books = await Book.find({});

        for (let book of books) {
            const author = await Author.findById(book.author);

            if (author) {
                if (!author.books.includes(book._id)) {
                    author.books.push(book._id);
                    await author.save();
                    console.log(`Added book ${book.title} to author ${author.name}`);
                }
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

updateAuthorsTableToIncludeBooks();
