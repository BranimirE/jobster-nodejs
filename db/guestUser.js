const Job = require('../models/Job')
const User = require('../models/User')
const mockData = require('./mock-data.json')

const GUEST_USERNAME = 'Guest'
const GUEST_PASSWORD = 'secret'
const GUEST_EMAIL = 'testUser@test.com'

const populateGuestData = async (guestUser) => {
  const guestData = mockData.map((mockJob) => ({
    ...mockJob,
    createdBy: guestUser._id,
  }))
  await Job.deleteMany({ createdBy: guestUser._id })
  await Job.create(guestData)
}

const populateGuestUser = async () => {
  let guest = await User.findOne({
    email: GUEST_EMAIL,
  })
  if (!guest) {
    guest = await User.create({
      name: GUEST_USERNAME,
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    })
  }
  console.log('guest', guest)
  populateGuestData(guest)
}

module.exports = { populateGuestUser, populateGuestData, GUEST_EMAIL }
