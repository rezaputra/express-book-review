import express from 'express'
import jwt from 'jsonwebtoken'
import books from './booksdb.js'
import 'dotenv/config.js'

const regd_users = express.Router()
const SECRET_KEY = process.env.JWT_SECRET
let users = [
   { username: 'user1', email: 'user1@example.com', password: 'password1' },
]

const isValid = (username) => {
   return users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => {
   const user = users.find((user) => user.username === username)
   if (user && user.password === password) {
      return true // Authentication successful
   }
   return false // Authentication failed
}

regd_users.post('/login', (req, res) => {
   const { username, password } = req.body

   if (!username || !password) {
      return res
         .status(400)
         .json({ message: 'Username and password are required' })
   }

   if (isValid(username) && authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, SECRET_KEY, {
         expiresIn: '24h',
      })

      return res
         .status(200)
         .json({ message: 'Customer succesfully login', token: token })
   }

   return res.status(401).json({ message: 'Invalid username or password' })
})

regd_users.put('/auth/review/:isbn', (req, res) => {
   const isbn = req.params.isbn
   const { review } = req.body

   const bookIndex = books.findIndex((book) => book[isbn])

   if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' })
   }

   if (!books[bookIndex].reviews) {
      books[bookIndex].reviews = []
   }

   books[bookIndex].reviews.push(review)

   return res.status(200).json({ message: 'Review added successfully' })
})

export { regd_users, isValid, users }
