const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const Project = sequelize.define('Project', {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    underscored: true,
    tableName: 'projects'
  })

  return Project
}