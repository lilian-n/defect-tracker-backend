const { DataTypes } = require('sequelize')


module.exports = function (sequelize) {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
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
      }
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    validate: {
      ifRoleRequiresProject() {
        if ((this.role !== 'ADMIN') && (this.assignedProject === null)) {
          throw new Error(`A project needs to be assigned with ${this.role} role`)
        }
        if ((this.role === 'ADMIN') && (this.assignedProject !== null)) {
          throw new Error(`A project cannot be assigned with ${this.role} role`)
        }
      },
    }
  })

  return User
}
