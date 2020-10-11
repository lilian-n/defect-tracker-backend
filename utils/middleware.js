const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const convertToDate = (dateString) => {
  // dateString should be in format 'mm,dd,yyyy'
  if (!dateString) {
    return null
  }

  const month = Number(dateString.slice(0, 2)) - 1
  const day = Number(dateString.slice(3, 5))
  const year = Number(dateString.slice(6, 10))

  return new Date(year, month, day)
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
  requestLogger,
  unknownEndpoint,
  errorHandler,
  convertToDate
}