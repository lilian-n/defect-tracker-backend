const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const Defect = sequelize.define('Defect', {
    defectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    identifiedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['open', 'closed']]
      },
      defaultValue: 'open'
    },
    priority: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['low', 'medium', 'high', 'immediate']]
      }
    },
    targetResolutionDate: {
      type: DataTypes.DATEONLY
    },
    actualResolutionDate: {
      type: DataTypes.DATEONLY
    },
    progress: {
      type: DataTypes.TEXT
    },
    resolutionSummary: {
      type: DataTypes.TEXT
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'defects'
  })

  return Defect
}