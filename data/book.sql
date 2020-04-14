DROP TABLE IF EXISTS books;

CREATE TABLE books
(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    img_url VARCHAR(255),
    descriptions TEXT,
    bookshelf VARCHAR(255)
);

INSERT INTO books
    (title,img_url,author,descriptions)
VALUES
    ('test', 'test', 'Razan', 'sdjsdvdscvsdc');
