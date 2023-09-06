const { connectDB, getMongoUri, closeDB } = require("../../src/db/connect")
const moongose = require('mongoose');
const User = require("../../src/models/User");
const app = require("../../src/app");
const request = require('supertest');
const Job = require("../../src/models/Job");

let token;
let testingUser;

const userTestData = {
  name: 'TestUser',
  email: 'test.jobs.routes@testemail.com',
  password: 'secret',
}

beforeAll(async () => {
  await connectDB(await getMongoUri())
  //Creating a testing user
  await User.findOneAndRemove({email: userTestData.email})
  testingUser = await User.create(userTestData)
  token = testingUser.createJWT()
})

afterAll(async () => {
  await closeDB()
})

describe('Jobs API', () => {
  it('GET /api/v1/jobs', async () => {
    const job = await Job.create({
      company : "Meta",
      jobLocation : "San Francisco",
      jobType : "full-time",
      position : "Backend Developer",
      status : "interview",
      createdBy: testingUser._id
    })
    const response = await request(app).get('/api/v1/jobs').set('Authorization', `Bearer ${token}`).send()
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.jobs)).toBeTruthy()

    // The recently created job was returned in the response
    const testJob = response.body.jobs.find(jobItem => jobItem._id == job._id)
    expect(testJob).toBeTruthy()
    expect(testJob.company).toBe(job.company)
    expect(testJob.jobLocation).toBe(job.jobLocation)
    expect(testJob.jobType).toBe(job.jobType)
    expect(testJob.position).toBe(job.position)
    expect(testJob.status).toBe(job.status)

    // All the returned jobs belongs to the testingUser user
    expect(response.body.jobs.every(jobItem => jobItem.createdBy == testingUser._id)).toBeTruthy()
  })

  it('POST /api/v1/jobs', async () => {
    const job_data = {
      company : "Meta",
      jobLocation : "San Francisco",
      jobType : "full-time",
      position : "Backend Developer",
      status : "interview",
    }
    const response = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(job_data)
    // Check the response
    expect(response.status).toBe(201)
    expect(response.body.job.company).toBe(job_data.company)
    expect(response.body.job.jobLocation).toBe(job_data.jobLocation)
    expect(response.body.job.jobType).toBe(job_data.jobType)
    expect(response.body.job.position).toBe(job_data.position)
    expect(response.body.job.status).toBe(job_data.status)

    // Check the data in the database
    const job = await Job.findOne({_id: response.body.job._id})
    expect(job).toBeTruthy()
    expect(job.company).toBe(job_data.company)
    expect(job.jobLocation).toBe(job_data.jobLocation)
    expect(job.jobType).toBe(job_data.jobType)
    expect(job.position).toBe(job_data.position)
    expect(job.status).toBe(job_data.status)
  })
})
