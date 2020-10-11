const Sequelize = require('sequelize')
const config = require('../utils/config')
const { associateModels } = require('./modelAssociations')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: config.LOGGING
})

const modelDefiners = [
  require('./models/project'),
  require('./models/user'),
  require('./models/defect')
]

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize)
}

associateModels(sequelize)

module.exports = sequelize