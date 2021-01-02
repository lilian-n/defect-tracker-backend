const { DataTypes } = require('sequelize')
const moment = require('moment')

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
      allowNull: false,
      get() {
        const dateValue = this.getDataValue('dateIdentified')
        return moment(dateValue).format('MM/DD/YYYY')
      },
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
      type: DataTypes.DATEONLY,
      get() {
        const dateValue = this.getDataValue('targetResDate')

        if (!!dateValue) {
          return moment(dateValue).format('MM/DD/YYYY')
        } else {
          return null
        }
      }
    },
    actualResDate: {
      type: DataTypes.DATEONLY,
      get() {
        const dateValue = this.getDataValue('actualResDate')

        if (!!dateValue) {
          return moment(dateValue).format('MM/DD/YYYY')
        } else {
          return null
        }
      }
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