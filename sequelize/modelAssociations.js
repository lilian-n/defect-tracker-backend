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
}

module.exports = { associateModels }