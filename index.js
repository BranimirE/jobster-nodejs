const connectDB = require('./db/connect')
const app = require('./app')
const { populateGuestUser } = require('./db/guestUser')

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await populateGuestUser()
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
