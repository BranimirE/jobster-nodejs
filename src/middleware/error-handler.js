// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log('Error', JSON.stringify(err, null, 2))
  const customError = {
    // Default values
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  if (err.code === 11000) {
    customError.msg = `Duplicate value entered for '${Object.keys(
      err.keyValue,
    )}' field, please choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
