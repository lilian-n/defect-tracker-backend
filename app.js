const express = require('express')
require('express-async-errors')
const middleware = require('./utils/middleware')
const cors = require('cors')

const projectsRouter = require('./controllers/projects')
const usersRouter = require('./controllers/users')
const defectsRouter = require('./controllers/defects')
const commentsRouter = require('./controllers/comments')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api', middleware.jwtCheck)

app.use('/api/projects', projectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/defects', defectsRouter)
app.use('/api/comments', commentsRouter)

// app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app