const defectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

function isAdmin(user) {
  return user.role === 'ADMIN'
}

function isAssociatedWithDefect(user, defect) {
  if (user.role === 'ADMIN') {
    return true
  }

  if (user.id === defect.identifierId) {
    return true
  }

  if (user.id === defect.assignedDevId) {
    return true
  }

  if ((user.role === 'PROJECT LEAD') && (user.projectId === defect.projectId)) {
    return true
  }

  return false
}

defectsRouter.get('/', async (request, response) => {
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('This user does not have permission to fetch defects.')
  }

  const defects = await models.Defect.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [
      {
        as: 'comments',
        model: models.Comment,
        attributes: ['id', 'content', 'authorId']
      }
    ]
  })
  response.json(defects)
})

defectsRouter.get('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  const defect = await models.Defect.findOne({
    where: { id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [
      {
        as: 'comments',
        model: models.Comment,
        attributes: ['id', 'content', 'authorId']
      }
    ]
  })

  if ((!isAdmin(submitter)) && (submitter.projectId !== defect.projectId)) {
    return response.status(400).send('This user does not have permission to view this defect.')
  }

  response.json(defect)
})

defectsRouter.get('/defects-by-project/:id', async (request, response) => {
  const projectId = helpers.getIdParam(request)
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if ((!isAdmin(submitter)) && (submitter.projectId !== projectId)) {
    return response.status(400).send('This user does not have permission to view these defects.')
  }

  const defects = await models.Defect.findAll({ where: { projectId } })
  response.json(defects)
})

defectsRouter.post('/', async (request, response) => {
  const auth0Id = request.user.sub
  const body = request.body
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if ((!isAdmin(submitter)) && (submitter.projectId !== body.projectId)) {
    return response.status(400).send('This user does not have permission to post defects to this project')
  }

  const newDefect = {
    summary: body.summary,
    description: body.description || "",
    dateIdentified: body.dateIdentified || new Date(),
    priority: body.priority || "",
    targetResDate: body.targetResDate || null,
    progress: body.progress || "",
    identifierId: submitter.id,
    projectId: body.projectId,
  }

  const savedDefect = await models.Defect.create(newDefect)
  response.json(savedDefect.toJSON())
})

defectsRouter.put('/:id', async (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id !== id) {
    return response.status(400).send(`Bad request: id(${id}) does not match body id(${body.id})`)
  }

  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })
  const defect = await models.Defect.findByPk(id)

  if (!isAssociatedWithDefect(submitter, defect)) {
    return response.status(400).send('This user does not have permission to edit this defect.')
  }

  const updateValues = {
    summary: body.summary,
    description: body.description,
    status: body.status,
    dateIdentified: body.dateIdentified,
    priority: body.priority,
    targetResDate: body.targetResDate,
    actualResDate: body.actualResDate,
    progress: body.progress,
    resolutionSummary: body.resolutionSummary,
    assignedDevId: body.assignedDevId,
  }

  models.Defect
    .update(updateValues, {
      returning: true,
      where: { id },
      individualHooks: true
    })
    .then(function ([rowsUpdate, [updatedDefect]]) {
      response.json(updatedDefect.toJSON())
    })
    .catch(next)
})

defectsRouter.delete('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })
  const defect = await models.Defect.findByPk(id)

  if (!isAssociatedWithDefect(submitter, defect)) {
    return response.status(400).send('This user does not have permission to delete this defect.')
  }

  await models.Defect.destroy({ where: { id } })
  response.status(204).end()
})

module.exports = defectsRouter