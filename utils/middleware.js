const logger = require('./logger')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const config = require('./config')

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://defect-tracker.us.auth0.com/.well-known/jwks.json'
  }),
  audience: config.AUTH0_AUDIENCE,
  issuer: config.AUTH0_ISSUER_URL,
  algorithms: ['RS256']
})

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({
      error: error.message
    })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({
      error: error.message
    })
  } else if (error.name == 'SequelizeForeignKeyConstraintError') {
    return response.status(400).json({
      error: 'Selection does not exist'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'Error') {
    return response.status(500).json({
      error: error.message
    })
  }

  next(error)
}

module.exports = {
  jwtCheck,
  requestLogger,
  unknownEndpoint,
  errorHandler
}