const request = require('supertest')
const app = require('../app')
const connectDB = require('../db/connect')
const mongoose = require('mongoose')

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("DB connected")
}, 20 * 1000) // 20 secs timeout

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(() => resolve(), 10000));
}, 15 * 1000) // 15 secs timeout

describe('Users API', () => {
  it('should create a new user', () => {

  })
}) 
