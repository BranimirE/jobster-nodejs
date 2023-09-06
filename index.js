const { connectDB, getMongoUri } = require('./src/db/connect')
const app = require('./src/app')
const { populateGuestUser } = require('./src/db/guestUser')

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(await getMongoUri())
    await populateGuestUser()
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
