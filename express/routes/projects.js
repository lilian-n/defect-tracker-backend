const { models } = require('../../sequelize')
const { getIdParam } = require('../helper')
const { convertToDate } = require('../../utils/middleware')

const getAll = async (request, response) => {
  const projects = await models.Project.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(projects)
}

const getById = async (request, response) => {
  const id = getIdParam(request)
  const project = await models.Project.findOne({
    where: {
      projectId: id
    },
    include: [{
      model: models.User,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'assignedProject']
      }
    },
    {
      model: models.Defect,
      include: [{ model: models.User, as: 'assignedDeveloper' }],
      attributes: ['defectId', 'summary', 'status']
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(project)
}

const create = async (request, response) => {
  const body = request.body
  const targetEndDate = convertToDate(body.targetEndDate)

  const newProject = {
    projectName: body.projectName,
    startDate: new Date(),
    targetEndDate
  }

  const savedProject = await models.Project.create(newProject)
  response.json(savedProject)
}

const update = (request, response, next) => {
  const id = getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const startDate = convertToDate(body.startDate)
    const targetEndDate = convertToDate(body.targetEndDate)
    const actualEndDate = convertToDate(body.actualEndDate)

    const updateValues = {
      projectName: body.projectName,
      startDate,
      targetEndDate,
      actualEndDate
    }

    models.Project
      .update(updateValues, {
        returning: true,
        where: { projectId: id }
      })
      .then(function ([rowsUpdate, [updatedProject]]) {
        response.json(updatedProject)
      })
      .catch(next)
  } else {
    response.status(400).send(`Bad request: id (${id}) does not match body id (${body.id})`)
  }
}

const remove = async (request, response) => {
  const id = getIdParam(request)
  await models.Project.destroy({
    where: {
      projectId: id
    }
  })
  response.status(204).end()
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}