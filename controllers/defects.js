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

  if (user.id === identifier) {
    return true
  }
  if (user.id === assignedDev) {
    return true
  }
  if ((user.role === 'PROJECT LEAD') && (user.projectId === defectProject)) {
    return true
  }
  return false
}

defectsRouter.get('/', async (request, response) => {
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

  response.json(defect)
})

defectsRouter.post('/', async (request, response) => {
  const auth0Id = request.user.sub
  const body = request.body

  const submitter = await models.User.findOne({
    where: {
      auth0Id
    }
  })

  if (isLeadOrMember(submitter) && (submitter.projectId !== body.projectId)) {
    response.status(400).send(`This user does not have permission to post defects to this project`)
  } else {
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
  }
})

defectsRouter.put('/:id', async (request, response, next) => {
  const auth0Id = request.user.sub
  const id = helpers.getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const submitter = await models.User.findOne({
      where: {
        auth0Id
      }
    })

    if (await isAssociatedWithDefect(submitter, id)) {
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
          where: { id }
        })
        .then(function ([rowsUpdate, [updatedDefect]]) {
          response.json(updatedDefect.toJSON())
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
        id: id
      }
    })

  response.status(204).end()
})

module.exports = defectsRouter