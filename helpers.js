// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
const getIdParam = (req) => {
  const id = req.params.id

  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }

  throw new TypeError(`Invalid ':id' param: "${id}"`)
}

const convertToDate = (dateString) => {
  // dateString should be in format 'yyyy-mm-dd'
  if (!dateString) {
    return null
  }

  const year = Number(dateString.slice(0, 4))
  const month = Number(dateString.slice(5, 7)) - 1
  const day = Number(dateString.slice(8, 10))

  return new Date(year, month, day)
}

module.exports = {
  getIdParam,
  convertToDate
}