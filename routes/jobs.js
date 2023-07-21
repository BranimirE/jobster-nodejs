const express = require('express')
const {
  createJob,
  getAllJobs,
  getJob,
  deleteJob,
  updateJob,
} = require('../controllers/jobs')
const testUser = require('../middleware/test-user')
const router = express.Router()

router.route('/').post(testUser, createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(testUser, deleteJob).patch(testUser, updateJob)

module.exports = router
