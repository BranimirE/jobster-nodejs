const app = require('../src/app')
const request = require('supertest')

describe('Landing Page', () => {
  it('should return the landing page', async () => {
    const response = await request(app).get('/').send()
    expect(response.status).toBe(200)
    expect(response.header['content-type']).toContain('text/html')
  })
})

