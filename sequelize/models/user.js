const { DataTypes } = require('sequelize')

module.exports = function (sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    auth0Id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['ADMIN', 'PROJECT LEAD', 'PROJECT MEMBER']
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      get() {
        const email = this.getDataValue('email')
        let splitted = email.split('@')
        let partOne = splitted[0];
        let avg = partOne.length / 2;
        partOne = partOne.substring(0, (partOne.length - avg));
        partTwo = splitted[1];
        return partOne + "...@" + partTwo;
      },
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    validate: {
      ifRoleRequiresProject() {
        if ((this.role !== 'ADMIN') && (this.projectId === null)) {
          throw new Error(`A project needs to be assigned with ${this.role} role`)
        }
        if ((this.role === 'ADMIN') && (this.projectId !== null)) {
          throw new Error(`A project cannot be assigned with ${this.role} role`)
        }
      },
    },
  })

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.createdAt
    delete values.updatedAt
    return values
  }

  return User
}
