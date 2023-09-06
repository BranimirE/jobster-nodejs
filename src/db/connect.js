const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const makeMongoURI = (host, dbName, username, password) =>
  `mongodb://${username}:${password}@${host}:27017/${dbName}?authMechanism=DEFAULT`

let mongoServer;

const getMongoUri = async () => {
  if (process.env.NODE_ENV === 'test') {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create()
    }
    return mongoServer.getUri()
  }

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
  return mongoURI
}

const connectDB = async (uri) => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${uri}`)
  })
}

module.exports = {
  connectDB,
  getMongoUri,
}
