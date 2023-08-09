// const { beforeAll, afterAll, describe, it } = require('jest')
// const request = require('supertest')
// const app = require('../app')
const connectDB = require('../db/connect')
const mongoose = require('mongoose')

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Users API', () => {
  it('should create a new user', () => {})
})
