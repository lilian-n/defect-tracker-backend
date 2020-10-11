const { models } = require('../../sequelize')

const getAll = async (request, response) => {
  const defects = await models.Defect.findAll()
  response.json(defects)
}

module.exports = {
  getAll
}