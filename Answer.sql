-- Creating the Library database
CREATE DATABASE LibraryDB;
USE LibraryDB;

-- Table for storing Book details
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,          -- Unique identifier for books
    Title VARCHAR(255) NOT NULL,                    -- Title of the book
    Author VARCHAR(255) NOT NULL,                   -- Author of the book
    ISBN VARCHAR(13) UNIQUE,                       -- ISBN number of the book, unique
    PublishedYear YEAR,                             -- Year the book was published
    Genre VARCHAR(100)                              -- Genre of the book
);

-- Table for storing Patron details (Library Members)
CREATE TABLE Patrons (
    PatronID INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for patrons
    FirstName VARCHAR(100) NOT NULL,               -- Patron's first name
    LastName VARCHAR(100) NOT NULL,                -- Patron's last name
    Email VARCHAR(100) UNIQUE NOT NULL,            -- Email of the patron, must be unique
    DateOfBirth DATE,                              -- Patron's date of birth
    MembershipDate DATE NOT NULL                   -- Date when the patron joined the library
);

-- Table for storing Transaction details (Borrowing/Returning books)
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for transactions
    PatronID INT,                                  -- Foreign Key to Patrons
    BookID INT,                                    -- Foreign Key to Books
    BorrowDate DATE NOT NULL,                      -- Date when the book was borrowed
    ReturnDate DATE,                               -- Date when the book was returned
    Status ENUM('Borrowed', 'Returned') NOT NULL,  -- Status of the book
    FOREIGN KEY (PatronID) REFERENCES Patrons(PatronID),  -- Ensuring integrity between Transactions and Patrons
    FOREIGN KEY (BookID) REFERENCES Books(BookID)       -- Ensuring integrity between Transactions and Books
);

-- Sample data insertion for testing
INSERT INTO Books (Title, Author, ISBN, PublishedYear, Genre) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 'Fiction'),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 'Fiction');

INSERT INTO Patrons (FirstName, LastName, Email, DateOfBirth, MembershipDate) VALUES
('John', 'Doe', 'john.doe@example.com', '1985-05-15', '2023-01-10'),
('Jane', 'Smith', 'jane.smith@example.com', '1990-07-20', '2022-11-05');

INSERT INTO Transactions (PatronID, BookID, BorrowDate, ReturnDate, Status) VALUES
(1, 1, '2023-03-01', NULL, 'Borrowed'),
(2, 2, '2023-02-15', '2023-03-15', 'Returned');

-- Query example: List all books and their current borrowing status
SELECT b.Title, b.Author, t.Status, p.FirstName, p.LastName
FROM Books b
JOIN Transactions t ON b.BookID = t.BookID
JOIN Patrons p ON t.PatronID = p.PatronID;

# Library Management System

## Description
This is a simple library management system database designed using MySQL. It manages book details, patron information, and transactions (book borrow and return). 

## How to Run/Setup
1. Clone the repository.
2. Import the `library_management.sql` file into your MySQL database environment (MySQL Workbench, phpMyAdmin, etc.).
3. Execute the SQL queries to create the database, tables, and insert sample data.

## ERD
![ERD Screenshot](link_to_your_erd_screenshot_or_link)

## License
This project is licensed under the MIT License.
