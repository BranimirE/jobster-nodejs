const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const auth = async (req, _, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const testUser = payload.userId === '64b94e7377b0f0af2ab53028'
    req.user = { userId: payload.userId, name: payload.name, testUser }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
