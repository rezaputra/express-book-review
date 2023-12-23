import express from 'express'
import jwt from 'jsonwebtoken'
import { regd_users as customer_routes } from './routes/auth_users.js'
import { public_users as genl_routes } from './routes/general.js'
import 'dotenv/config.js'

const app = express()
app.use(express.json())

const SECRET_KEY = process.env.JWT_SECRET

if (!SECRET_KEY) {
   console.error('JWT secret key not provided.')
   process.exit(1)
}

const auth = (req, res, next) => {
   const token = req.headers.authorization

   if (!token) {
      return res.status(401).json({ message: 'No token provided' })
   }

   jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
         return res
            .status(200)
            .json({ review: 'Failed to authenticate token' })
      }

      req.user = decoded
      next()
   })
}

app.use('/customer/auth/*', auth)

const PORT = process.env.PORT || 8000

app.use('/customer', customer_routes)
app.use('/', genl_routes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
