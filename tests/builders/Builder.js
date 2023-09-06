module.exports.Builder = {
  user: ({ name = 'TestUserName', email = 'testuser@testemail.com', password = 'secret' } = {}) => ({
      name,
      email,
      password,
  })
}
