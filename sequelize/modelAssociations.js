const associateModels = (sequelize) => {
  const { Project, User, Defect } = sequelize.models

  Project.hasMany(User, {
    foreignKey: {
      name: 'assignedProject'
    }
  })

  User.belongsTo(Project, {
    foreignKey: {
      name: 'assignedProject'
    }
  })

  Project.hasMany(Defect, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Defect.belongsTo(Project, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Defect.belongsTo(User, {
    as: 'identifier',
    foreignKey: {
      allowNull: false
    }
  })

  Defect.belongsTo(User, {
    as: 'assignedDeveloper'
  })
}

module.exports = { associateModels }