const express = require('express')
require('express-async-errors')
const middleware = require('../utils/middleware')
const logger = require('../utils/logger')
const cors = require('cors')
const sequelize = require('../sequelize')
const app = express()

const routes = {
  projects: require('./routes/projects'),
  users: require('./routes/users'),
  defects: require('./routes/defects')
}

logger.info('Checking database connection...')
sequelize.authenticate()
  .then(() => {
    logger.info('Database successfully connected!')
  })
  .catch((error) => {
    logger.error('Unable to connect:', error)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeController.getAll) {
    app.get(
      `/api/${routeName}`,
      routeController.getAll
    )
  }
  if (routeController.getById) {
    app.get(
      `/api/${routeName}/:id`,
      routeController.getById
    )
  }
  if (routeController.create) {
    app.post(
      `/api/${routeName}`,
      routeController.create
    )
  }
  if (routeController.update) {
    app.put(
      `/api/${routeName}/:id`,
      routeController.update
    )
  }
  if (routeController.remove) {
    app.delete(
      `/api/${routeName}/:id`,
      routeController.remove
    )
  }
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app