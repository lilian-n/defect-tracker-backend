const defectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

defectsRouter.get('/', async (request, response) => {
  const defects = await models.Defect.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(defects)
})

defectsRouter.get('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)

  const defect = await models.Defect.findOne({
    where: { defectId: id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{
      as: 'identifier',
      model: models.User,
      attributes: ['userId', 'firstName', 'lastName', 'fullName']
    },
    {
      as: 'assignedDev',
      model: models.User,
      attributes: ['userId', 'firstName', 'lastName', 'fullName']
    }]
  })

  response.json(defect)
})

defectsRouter.post('/', async (request, response) => {
  const body = request.body

  const identifier = await models.User.findByPk(body.identifierId)

  const newDefect = {
    summary: body.summary,
    description: body.description || null,
    identifiedDate: new Date(),
    priority: body.priority || null,
    targetResolutionDate: helpers.convertToDate(body.targetResolutionDate),
    progress: body.progress || null,
    identifierId: body.identifierId,
    projectId: body.projectId,
    createdBy: identifier.fullName,
    updatedBy: identifier.fullName
  }

  const savedDefect = await models.Defect.create(newDefect)
  response.json(savedDefect)
})

defectsRouter.put('/:id', async (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  const userUpdatingValue = await models.User.findByPk(body.updatingUserId)

  if (body.id === id) {
    const updateValues = {
      summary: body.summary,
      description: body.description,
      status: body.status,
      identifiedDate: helpers.convertToDate(body.identifiedDate),
      priority: body.priority,
      targetResolutionDate: helpers.convertToDate(body.targetResolutionDate),
      actualResolutionDate: body.actualResolutionDate,
      progress: body.progress,
      resolutionSummary: body.resolutionSummary,
      assignedDevId: body.assignedDevId,
      updatedBy: userUpdatingValue.fullName
    }

    models.Defect
      .update(updateValues, {
        returning: true,
        where: { defectId: id }
      })
      .then(function ([rowsUpdate, [updatedDefect]]) {
        response.json(updatedDefect)
      })
      .catch(next)
  } else {
    response.status(400).send(`Bad request: id(${id}) does not match body id(${body.id})`)
  }
})


module.exports = defectsRouter