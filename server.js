'use strict';
require('dotenv').config();
const pg = require('pg');
const express = require('express');
const PORT = process.env.PORT || 3030;
const app = express();
const superagent = require('superagent');

app.use(express.static('./public'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);

// all the routs 
app.post('/searches', getData);
app.get('/', getBooks);
app.get('/books/:book_id', getBookDetails);
app.post('/books', insertBook);


function getBooks(req, res) {
    let SQL = 'SELECT * FROM books;';
    return client.query(SQL)
        .then(books => {
            console.log(books.rows);
            res.render('pages/index', { books: books.rows });
        })
}

app.get('/search', (req, res) => {
    res.render('./pages/serches/new');
})

function getData(req, res) {

    var url;
    if (req.body.serchtype === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.bookname}&intitle:${req.body.bookname}`;
        console.log('title Url :', url);

    }
    else if (req.body.serchtype === 'author') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.bookname}+inauthor:${req.body.bookname}`
        console.log('auther Url :', url);

    }
    superagent.get(url)
        .then(data => {
            let items = data.body.items;
            let books = items.map(book => {
                return new Book(book);
            });
            res.render('./pages/serches/show', { books: books })
        });

}

function getBookDetails(req, res) {
    let SQL = 'SELECT * FROM books WHERE id=$1;';
    let values = [req.params.book_id];
    return client.query(SQL, values)
        .then(result => {
            res.render('pages/books/detail', { details: result.rows[0] });
        })
}
function insertBook(req, res) {
    let {title, author, isbn, image_url, descriptions} = req.body;
    let SQL = 'INSERT INTO books(author,title,isbn,img_url,descriptions) VALUES ($1,$2,$3,$4,$5);';
    let saveValues = [title, author, isbn, image_url, descriptions];
    return client.query(SQL, saveValues)
        .then(() => {
            res.redirect('/');

        })
}

function Book(book) {
    this.title = book.volumeInfo.title;
    this.smallThumbnail = book.volumeInfo.imageLinks.smallThumbnail;
    this.authors = book.volumeInfo.authors;
    this.descriptions = book.volumeInfo.description;
    this.bookshelf = book.volumeInfo.bookshelf;
    this.isbn = book.volumeInfo.industryIdentifiers[0].type;
}

app.get('*', (req, res) => {
    res.status(404).send('This route does not exist!!');
})
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`)
        })

    })