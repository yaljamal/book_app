'use strict';

require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3030;
const app = express();
const superagent = require('superagent');

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
})
app.post('/searches', (req, res) => {

    var url;
    if (req.body.serchtype === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.bookname}&intitle=${req.body.bookname}`;
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
            res.render('serches/show', { books: books })
        });

});
function Book(book) {
    this.title = book.volumeInfo.title;
    this.smallThumbnail = book.volumeInfo.imageLinks.smallThumbnail;
    this.authors = book.volumeInfo.authors;
    this.description = book.volumeInfo.description;

}

app.get('*', (req, res) => {
    res.status(404).send('This route does not exist!!');
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})