const commentsRouter = require('express').Router()
const { models } = require('../sequelize')
const helpers = require('../helpers')

commentsRouter.get('/', async (request, response) => {
  const comments = await models.Comment.findAll()
  response.json(comments)
})

commentsRouter.get('/:id', async (request, response) => {
  const id = helpers.getIdParam(request)

  const comment = await models.Comment.findOne({
    where: { id },
  })

  response.json(comment)
})

commentsRouter.get('/defect/:id', async (request, response) => {
  const defectId = helpers.getIdParam(request)

  const comments = await models.Comment.findAll({
    where: {
      defectId
    }
  })

  response.json(comments)
})

commentsRouter.post('/', async (request, response) => {
  const auth0Id = request.user.sub
  const body = request.body

  const submitter = await models.User.findOne({
    where: {
      auth0Id
    }
  })

  const newComment = {
    defectId: body.defectId,
    content: body.content,
    authorId: 1
  }

  const savedComment = await models.Comment.create(newComment)
  response.json(savedComment)
})

module.exports = commentsRouter