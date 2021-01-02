const { DataTypes } = require('sequelize')
const moment = require('moment')

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
      get() {
        const dateValue = this.getDataValue('startDate')
        return moment(dateValue).format('MM/DD/YYYY')
      },
    },
    targetEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        const dateValue = this.getDataValue('targetEndDate')

        if (!!dateValue) {
          return moment(dateValue).format('MM/DD/YYYY')
        } else {
          return null
        }
      },
      allowNull: false,
    },
    actualEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      get() {
        const dateValue = this.getDataValue('actualEndDate')

        if (!!dateValue) {
          return moment(dateValue).format('MM/DD/YYYY')
        } else {
          return null
        }
      }
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