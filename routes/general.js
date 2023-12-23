import express from 'express'
import books from './booksdb.js'
import 'dotenv/config.js'

const public_users = express.Router()
// const jwt_secret_key = process.env.JWT_SECRET

let users = []

public_users.post('/register', (req, res) => {
   const { username, password, email } = req.body

   if (!username || !password || !email) {
      return res
         .status(400)
         .json({ message: 'Username, password, and email are required' })
   }

   // Check if the username or email already exists
   const existingUser = users.find(
      (user) => user.username === username || user.email === email
   )
   if (existingUser) {
      return res
         .status(400)
         .json({ message: 'Username or email already exists' })
   }

   // Assuming a simple user object structure for registration
   const newUser = {
      username,
      password, // In practice, ensure passwords are hashed for security
      email,
      // Additional user properties can be added here
   }

   users.push(newUser)

   return res
      .status(200)
      .json({ message: 'User registered successfully', user: newUser })
})

public_users.get('/', async (req, res) => {
   try {
      const response = await axios.get(BOOKS_API_URL)
      const books = response.data
      return res.status(200).json({ books })
   } catch (error) {
      return res.status(500).json({ message: 'Error fetching books' })
   }
})

public_users.get('/isbn/:isbn', (req, res) => {
   const isbn = req.params.isbn
   axios
      .get(`${BOOKS_API_URL}/isbn/${isbn}`)
      .then((response) => {
         const book = response.data.book
         if (!book) {
            return res.status(404).json({ message: 'Book not found' })
         }
         return res.status(200).json({ book })
      })
      .catch((error) => {
         return res.status(500).json({ message: 'Error searching by ISBN' })
      })
})

public_users.get('/author/:author', async (req, res) => {
   const authorName = req.params.author
   try {
      const response = await axios.get(`${BOOKS_API_URL}/author/${authorName}`)
      const booksByAuthor = response.data.books
      if (booksByAuthor.length === 0) {
         return res
            .status(404)
            .json({ message: 'Books by this author not found' })
      }
      return res.status(200).json({ books: booksByAuthor })
   } catch (error) {
      return res.status(500).json({ message: 'Error searching by author' })
   }
})

public_users.get('/title/:title', (req, res) => {
   const title = req.params.title
   axios
      .get(`${BOOKS_API_URL}/title/${title}`)
      .then((response) => {
         const booksWithTitle = response.data.books
         if (booksWithTitle.length === 0) {
            return res
               .status(404)
               .json({ message: 'Books with this title not found' })
         }
         return res.status(200).json({ books: booksWithTitle })
      })
      .catch((error) => {
         return res.status(500).json({ message: 'Error searching by title' })
      })
})

public_users.get('/review/:isbn', (req, res) => {
   const isbn = req.params.isbn
   const book = books[isbn]
   if (!book || !book.reviews) {
      return res.status(404).json({ message: 'Review not found for this book' })
   }
   return res.status(200).json({ reviews: book.reviews })
})

export { public_users }
