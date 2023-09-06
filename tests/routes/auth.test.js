const User = require('../../src/models/User')
const app = require('../../src/app')
const request = require('supertest')
const { connectDB, getMongoUri, closeDB } = require('../../src/db/connect')
const { Builder } = require('../builders/Builder')

beforeAll(async () => {
  await connectDB(await getMongoUri())
})

afterAll(async () => {
  await closeDB()
})

describe('Auth API', () => {

  it('POST /api/v1/auth/register', async () => {
    const data = Builder.user()

    // Ensure that the user does not exist
    await User.findOneAndRemove({ email: data.email })

    const response = await request(app).post('/api/v1/auth/register').send(data)

    // Check response
    expect(response.status).toBe(201)
    expect(response.body.user.email).toBe(data.email)
    expect(response.body.user.name).toBe(data.name)

    // Check the data in the database
    const user = await User.findOne({ email: data.email })
    expect(user).toBeTruthy()
    expect(user.email).toBe(data.email)
    expect(user.name).toBe(data.name)

    // Remove the user
    await User.findOneAndRemove({ email: user.email })
  })

  it('POST /api/v1/auth/login', async () => {
    const user = Builder.user()
    // Remove the user if it already exists
    await User.findOneAndRemove({ email: user.email })
    await User.create(user)

    const response = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password
    })
    expect(response.status).toBe(200)
    expect(response.body.user.name).toBe(user.name)
    expect(response.body.user.email).toBe(user.email)
    expect(response.body.user.token).toBeTruthy()

    await User.findOneAndRemove({ email: user.email })
  })

  it('PATCH /api/v1/auth/updateUser', async () => {
    const userData = Builder.user()
    const updateData = {
      name: 'TestUserNameUpdated',
      email: 'testuserupdate@testemail.com',
      lastName: 'lastNameValue',
      location: 'New location'
    }
    // Remove the user if it already exists and the one that we are going to update for
    await User.findOneAndRemove({ email: userData.email })
    // We cannot update the email if it alredy exist
    await User.findOneAndRemove({ email: updateData.email })
    let user = await User.create(userData)
    const token = user.createJWT()

    const response = await request(app).patch('/api/v1/auth/updateUser').set('Authorization', `Bearer ${token}`).send(updateData)

    // It should respond the updated data
    expect(response.status).toBe(200)

    expect(response.body.user).toMatchObject(updateData)
    expect(response.body.user.token).toBeTruthy()

    // Check database data
    user = await User.findOne({_id: user._id})
    expect(user).toMatchObject(updateData)

    // Remove the updated user
    await user.delete()
  })
})
