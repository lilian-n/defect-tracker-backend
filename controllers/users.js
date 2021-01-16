const usersRouter = require('express').Router()
const { models } = require('../sequelize')
const { getIdParam } = require('../helpers')


function isAdmin(user) {
  return user.role === 'ADMIN'
}

usersRouter.get('/', async (request, response) => {
  const users = await models.User.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(users)
})

usersRouter.get('/authenticatedUser', async (request, response) => {
  const auth0Id = request.user.sub

  const user = await models.User.findOne({ where: { auth0Id } })
  response.json(user)
})

usersRouter.get('/:id', async (request, response) => {
  const id = getIdParam(request)

  const user = await models.User.findOne({
    where: { id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(user.toJSON())
})

usersRouter.get('/users-by-project/:id', async (request, response) => {
  const projectId = helpers.getIdParam(request)

  const users = await models.User.findAll({
    where: { projectId },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const auth0Id = request.user.sub

  const body = request.body

  const newUser = {
    auth0Id: auth0Id,
    name: body.name,
    role: body.role,
    email: body.email,
    occupation: body.occupation,
    projectId: body.projectId || null
  }

  const postedUser = await models.User.create(newUser)
  response.json(postedUser.toJSON())
})

usersRouter.put('/:id', async (request, response, next) => {
  const id = getIdParam(request)
  const body = request.body

  if (body.id !== id) {
    return response.status(400).send(`Bad request: id(${id}) does not match body id(${body.id})`)
  }

  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('Not authorized to update user')
  }

  if (isAdmin(submitter) && submitter.id !== id) {
    return response.status(400).send('Only administrator can update their own user profile.')
  }

  const updateValues = {
    name: body.name,
    role: body.role,
    email: body.email,
    occupation: body.occupation,
    projectId: body.projectId || null
  }

  models.User
    .update(updateValues, {
      returning: true,
      where: { id }
    })
    .then(function ([rowsUpdate, [updatedUser]]) {
      response.json(updatedUser)
    })
    .catch(next)
})

usersRouter.delete('/:id', async (request, response) => {
  const id = getIdParam(request)
  const auth0Id = request.user.sub
  const submitter = await models.User.findOne({ where: { auth0Id } })

  if (!isAdmin(submitter)) {
    return response.status(400).send('Not authorized to delete user')
  }

  if (isAdmin(submitter) && submitter.id !== id) {
    return response.status(400).send('Only administrator can remove their own user profile.')
  }

  await models.User.destroy({ where: { id } })
  response.status(204).end()
})

module.exports = usersRouter