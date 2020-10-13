const usersRouter = require('express').Router()
const { models } = require('../sequelize')
const { getIdParam } = require('../helpers')


usersRouter.get('/', async (request, response) => {
  const users = await models.User.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = getIdParam(request)
  const user = await models.User.findOne({
    where: {
      userId: id
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const newUser = {
    firstName: body.firstName,
    lastName: body.lastName,
    role: body.role,
    email: body.email,
    occupation: body.occupation,
    assignedProject: body.assignedProject || null
  }

  const postedUser = await models.User.create(newUser)
  response.json(postedUser)
})

usersRouter.put('/:id', (request, response, next) => {
  const id = getIdParam(request)
  const body = request.body

  if (body.id === id) {
    const updateValues = {
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      email: body.email,
      occupation: body.occupation,
      assignedProject: body.assignedProject || null
    }

    models.User
      .update(updateValues, {
        returning: true,
        where: { userId: id }
      })
      .then(function ([rowsUpdate, [updatedUser]]) {
        response.json(updatedUser)
      })
      .catch(next)
  } else {
    response.status(400).send(`Bad request: id(${id}) does not match body id(${body.id})`)
  }
})

usersRouter.delete('/:id', async (request, response) => {
  const id = getIdParam(request)
  await models.User.destroy({
    where: {
      userId: id
    }
  })
  response.status(204).end()
})

module.exports = usersRouter