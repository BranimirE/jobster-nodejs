const mongoose = require('mongoose')

const makeMongoURI = (host, dbName, username, password) =>
  `mongodb://${username}:${password}@${host}:27017/${dbName}?authMechanism=DEFAULT`

const getMongoUri = () => {
  let mongoURI = process.env.MONGO_URI
  if (!mongoURI) {
    const {
      MONGODB_HOST,
      MONGODB_DATABASE,
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
    } = process.env
    mongoURI = makeMongoURI(
      MONGODB_HOST,
      MONGODB_DATABASE,
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
    )
  }
  console.log({mongoURI})
  return mongoURI
}

const connectDB = async (url) => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = {
  connectDB,
  getMongoUri,
}
