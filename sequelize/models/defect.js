const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const Defect = sequelize.define('Defect', {
    id: {
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
    dateIdentified: {
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
      values: ['', 'Low', 'Medium', 'High', 'Immediate'],
    },
    targetResDate: {
      type: DataTypes.DATEONLY
    },
    actualResDate: {
      type: DataTypes.DATEONLY
    },
    progress: {
      type: DataTypes.TEXT
    },
    resolutionSummary: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'defects'
  })

  Defect.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.createdAt
    delete values.updatedAt
    return values
  }

  return Defect
}