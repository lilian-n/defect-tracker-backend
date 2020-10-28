const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'comments'
  })

  return Comment
}