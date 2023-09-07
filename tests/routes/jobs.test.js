const { connectDB, getMongoUri, closeDB } = require("../../src/db/connect")
const User = require("../../src/models/User");
const app = require("../../src/app");
const request = require('supertest');
const Job = require("../../src/models/Job");
const { Builder } = require("../builders/Builder");

let token;
let testingUser;

const userTestData = {
  name: 'TestUser',
  email: 'test.jobs.routes@testemail.com',
  password: 'secret',
}

beforeAll(async () => {
  await connectDB(await getMongoUri())
  //Create a testing user
  await User.findOneAndRemove({email: userTestData.email})
  testingUser = await User.create(userTestData)
  token = testingUser.createJWT()
})

afterAll(async () => {
  await closeDB()
})

describe('Jobs API', () => {
  it('GET /api/v1/jobs', async () => {
    const jobData = Builder.job()
    const job = await Job.create({ createdBy: testingUser._id, ...jobData })
    const response = await request(app)
      .get('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.jobs)).toBeTruthy()

    // The recently created job was returned in the response
    const testJob = response.body.jobs.find((jobItem) => jobItem._id == job._id)
    expect(testJob).toMatchObject(jobData)

    // All the returned jobs belongs to the testingUser user
    expect(
      response.body.jobs.every(
        (jobItem) => jobItem.createdBy == testingUser._id,
      ),
    ).toBeTruthy()
  })

  it('POST /api/v1/jobs', async () => {
    const jobData = Builder.job()
    const response = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(jobData)
    // Check the response
    expect(response.status).toBe(201)
    expect(response.body.job).toMatchObject(jobData)

    // Check the data in the database
    const job = await Job.findOne({_id: response.body.job._id})
    expect(job).toMatchObject(jobData)
  })
})
