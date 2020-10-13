const projectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

projectsRouter.get('/', async (request, response) => {
  const projects = await models.Project.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(projects)
})

projectsRouter.get('/:id', async (request, response) => {
  const id = helpers.etIdParam(request)
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
      include: [{ as: 'assignedDev', model: models.User }],
      attributes: ['defectId', 'summary', 'status']
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(project)
})

projectsRouter.post('/', async (request, response) => {
  const body = request.body
  const targetEndDate = helpers.convertToDate(body.targetEndDate)

  const newProject = {
    projectName: body.projectName,
    startDate: new Date(),
    targetEndDate
  }

  const savedProject = await models.Project.create(newProject)
  response.json(savedProject)
})

projectsRouter.put('/:id', (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const startDate = helpers.convertToDate(body.startDate)
    const targetEndDate = helpers.convertToDate(body.targetEndDate)
    const actualEndDate = helpers.convertToDate(body.actualEndDate)

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
})

projectsRouter.delete('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  await models.Project.destroy({
    where: {
      projectId: id
    }
  })
  response.status(204).end()
})

module.exports = projectsRouter