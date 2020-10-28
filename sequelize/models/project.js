const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    targetEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    actualEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    }
  }, {
    tableName: 'projects'
  })

  Project.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.createdAt
    delete values.updatedAt
    return values
  }

  return Project
}