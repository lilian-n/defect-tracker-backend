const usersRouter = require('express').Router()
const { models } = require('../sequelize')
const { getIdParam } = require('../helpers')

const isAdmin = async (auth0Id) => {
  const user = await models.User.findOne({
    where: {
      auth0Id: auth0Id
    }
  })

  const role = user.role

  if (role === 'ADMIN') {
    return true
  }

  return false
}

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
      id: id
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  response.json(user.toJSON())
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // if (!(await isAdmin(auth0Id))) {
  //   response.status(400).send(`User is not authorized to add new user`)
  // }

  const newUser = {
    auth0Id: body.auth0Id,
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

  if (!(await isAdmin(auth0Id))) {
    response.status(400).send(`Not authorized to update user`)
  }

  if (body.id === id) {
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
        where: { id: id }
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

  // if (!(await isAdmin(auth0Id))) {
  //   response.status(400).send(`Not authorized to update user`)
  // }

  await models.User.destroy({
    where: {
      id: id
    }
  })
  response.status(204).end()
})

module.exports = usersRouter