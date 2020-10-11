require('dotenv').config()

let PORT = process.env.PORT
let DB_NAME = process.env.DB_NAME
let DB_USERNAME = process.env.DB_USERNAME
let DB_PASSWORD = process.env.DB_PASSWORD
let LOGGING = true

if (process.env.NODE_ENV === 'test') {
  DB_NAME = process.env.TEST_DB_NAME
  LOGGING = false
}

module.exports = {
  PORT,
  DB_NAME: DB_NAME,
  DB_USERNAME: DB_USERNAME,
  DB_PASSWORD: DB_PASSWORD,
  LOGGING
}