module.exports.Builder = {
  user: ({ name = 'TestUserName', email = 'testuser@testemail.com', password = 'secret' } = {}) => ({
      name,
      email,
      password,
  }),
  job: ({ company = "Meta", jobLocation = "San Francisco", jobType = "full-time", position = "Backend Developer", status = "interview", } = {}) => ({
      company ,
      jobLocation ,
      jobType ,
      position ,
      status ,
  })
}
