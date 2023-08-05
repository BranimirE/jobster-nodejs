require('dotenv').config()
require('express-async-errors')
const path = require('path')

// extra security packages
const helmet = require('helmet')
const xss = require('xss-clean')

const express = require('express')
const app = express()

// routes import
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// Middlewares
const authenticateUserMiddleware = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)

app.use(express.static(path.resolve(__dirname, './client/build/')))
app.use(express.json())
app.use(helmet())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUserMiddleware, jobsRouter)

// serve index.html
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, './client/build/', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app
