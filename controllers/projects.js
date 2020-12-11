const projectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')


const isAdmin = async (user) => {
  return user.role === 'ADMIN'
}

projectsRouter.get('/', async (request, response) => {
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
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if ((!isAdmin(submitter)) && submitter.projectId !== id) {
    return response.status(400).send('This user does not have permission to access project')
  }

  const project = await models.Project.findOne({
    where: { id },
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
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('This user does not have permission to create a new project')
  }

  const newProject = {
    title: body.title,
    description: body.description,
    startDate: body.startDate || new Date(),
    targetEndDate: body.targetEndDate
  }

  const savedProject = await models.Project.create(newProject)
  response.json(savedProject)
})

projectsRouter.put('/:id', async (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id !== id) {
    return response.status(400).send(`Bad request: id (${id}) does not match body id (${body.id})`)
  }

  const auth0Id = user.request.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('This user does not have permission to update project')
  }

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
      where: { id }
    })
    .then(function ([rowsUpdate, [updatedProject]]) {
      response.json(updatedProject)
    })
    .catch(next)
})

projectsRouter.delete('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  const auth0Id = user.request.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('This user does not have permission to update project')
  }

  await models.Project.destroy({ where: { id } })
  response.status(204).end()
})

module.exports = projectsRouter