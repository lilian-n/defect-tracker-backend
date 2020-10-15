const defectsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

const isLeadOrMember = (user) => {
  return (user.role === 'PROJECT LEAD') || (user.role === 'PROJECT MEMBER')
}

const isAssociatedWithDefect = async (user, defectId) => {
  const defect = await models.Defect.findByPk(defectId)
  const defectProject = defect.projectId
  const identifier = defect.identifierId
  const assignedDev = defect.assignedDevId

  if (user.userId === identifier) {
    return true
  }
  if (user.userId === assignedDev) {
    return true
  }
  if ((user.role === 'PROJECT LEAD') && (user.assignedProject === defectProject)) {
    return true
  }
  return false
}

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
      attributes: ['auth0Id', 'firstName', 'lastName', 'fullName']
    },
    {
      as: 'assignedDev',
      model: models.User,
      attributes: ['auth0Id', 'firstName', 'lastName', 'fullName']
    }]
  })

  response.json(defect)
})

defectsRouter.post('/', async (request, response) => {
  const body = request.body
  const submitter = await models.User.findByPk(body.submitterId)

  if (isLeadOrMember(submitter) && (submitter.assignedProject !== body.projectId)) {
    response.status(400).send(`This user does not have permission to post defects to this project`)
  } else {
    const newDefect = {
      summary: body.summary,
      description: body.description || null,
      identifiedDate: new Date(),
      priority: body.priority || null,
      targetResolutionDate: helpers.convertToDate(body.targetResolutionDate),
      progress: body.progress || null,
      identifierId: body.submitterId,
      projectId: body.projectId,
      createdBy: submitter.fullName,
      updatedBy: submitter.fullName
    }

    const savedDefect = await models.Defect.create(newDefect)
    response.json(savedDefect)
  }
})

defectsRouter.put('/:id', async (request, response, next) => {
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const submitter = await models.User.find(body.submitterId)

    if (await isAssociatedWithDefect(submitter, id)) {
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
        updatedBy: submitter.fullName
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
      response.status(400).send(`This user does not have permission to edit this defect.`)
    }
  } else {
    response.status(400).send(`Bad request: id(${id}) does not match body id(${body.id})`)
  }
})

defectsRouter.delete('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)
  const submitter = await models.User.findByPk(submitterId)
  if (await isAssociatedWithDefect(submitter, id))
    await models.Defect.destroy({
      where: {
        defectId: id
      }
    })

  response.status(204).end()
})

module.exports = defectsRouter