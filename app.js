const express = require('express')
require('express-async-errors')
const middleware = require('./utils/middleware')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

const projectsRouter = require('./controllers/projects')
const usersRouter = require('./controllers/users')
const defectsRouter = require('./controllers/defects')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
// app.use(jwtCheck)

app.use('/api/projects', projectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/defects', defectsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app