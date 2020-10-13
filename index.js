const app = require('./app')
const http = require('http')
const logger = require('./utils/logger')
const config = require('./utils/config')
const sequelize = require('./sequelize')
const seeder = require('./seeder')

const init = async () => {
  await sequelize.sync({ force: true })
  await seeder.seedEverything()
  const user = await sequelize.models.User.findByPk(1)
}

init()

logger.info('Checking database connection...')
sequelize.authenticate()
  .then(() => {
    logger.info('Database successfully connected!')
  })
  .catch((error) => {
    logger.error('Unable to connect:', error)
  })

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})