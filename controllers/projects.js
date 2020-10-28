const projectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

projectsRouter.get('/', async (request, response) => {
  console.log(request.user)
  const projects = await models.Project.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [
      {
        as: 'users',
        model: models.User,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'projectId']
        }
      },
      {
        as: 'defects',
        model: models.Defect,
        attributes: ['id', 'summary', 'status']
      }
    ]
  })
  response.json(projects)
})

projectsRouter.get('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  const project = await models.Project.findOne({
    where: {
      id: id
    },
    include: [{
      as: 'users',
      model: models.User,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'projectId']
      }
    },
    {
      as: 'defects',
      model: models.Defect,
      include: [{ as: 'assignedDev', model: models.User }],
      attributes: ['id', 'summary', 'status']
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(project)
})

projectsRouter.post('/', async (request, response) => {
  const body = request.body

  const newProject = {
    title: body.title,
    description: body.description,
    startDate: body.startDate || new Date(),
    targetEndDate: body.targetEndDate || new Date()
  }

  const savedProject = await models.Project.create(newProject)
  response.json(savedProject)
})

projectsRouter.put('/:id', (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const updateValues = {
      title: body.title,
      description: body.description,
      startDate: body.startDate,
      targetEndDate: body.targetEndDate,
      actualEndDate: body.actualEndDate
    }

    models.Project
      .update(updateValues, {
        returning: true,
        where: { id: id }
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
      id: id
    }
  })
  response.status(204).end()
})

module.exports = projectsRouter