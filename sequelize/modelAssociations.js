const sequelizeHistory = require('sequelize-history')

const associateModels = (sequelize) => {
  const { Project, User, Defect, Comment } = sequelize.models

  Project.hasMany(User, {
    as: 'users',
    foreignKey: {
      name: 'projectId'
    }
  })

  User.belongsTo(Project, {
    as: 'project',
    foreignKey: {
      name: 'projectId'
    }
  })

  Project.hasMany(Defect, {
    as: 'defects',
    foreignKey: {
      name: 'projectId',
      allowNull: false
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  Defect.belongsTo(Project, {
    as: 'project',
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Defect.belongsTo(User, {
    as: 'identifier',
    foreignKey: {
      name: 'identifierId',
      allowNull: false
    }
  })

  Defect.belongsTo(User, {
    as: 'assignedDev',
    foreignKey: {
      name: 'assignedDevId'
    }
  })

  Defect.hasMany(Comment, {
    as: 'comments',
    foreignKey: {
      name: 'defectId',
      allowNull: false
    },
    onDelete: 'CASCADE',
    hooks: true
  })

  Comment.belongsTo(Defect, {
    as: 'defect',
    foreignKey: {
      name: 'defectId',
      allowNull: false
    }
  })

  Comment.belongsTo(User, {
    as: 'author',
    foreignKey: {
      name: 'authorId',
      allowNull: false
    }
  })

  sequelizeHistory(Project, sequelize, {
    authorFieldName: "authorId",
    excludedAttributes: ["createdAt", "updatedAt"]
  })

  sequelizeHistory(Defect, sequelize, {
    authorFieldName: "authorId",
    excludedAttributes: ["createdAt", "updatedAt"]
  })
}

module.exports = { associateModels }