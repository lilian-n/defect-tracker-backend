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
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['OPEN', 'CLOSED'],
      defaultValue: 'OPEN'
    },
    priority: {
      type: DataTypes.ENUM,
      values: ['LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'],
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