'use strict'
const { checkValidTz } = require('../model/common')
const { cronInfo } = require('../model/cron')
//Imports
const db = require('../model/mongodb')
const logger = require("../model/logger")(__filename)

module.exports = function () {
  let router = {}

  router.amScheduler = (req, res) => {
    try {
      return res.send("Welcome to scheduler api")
    } catch (error) {
      return res.send(`Error message : ${error.message}`)
    }
  }

  router.stopJob = async (req, res) => {
    try {
      let timezoneData = req.body, jobInfo, checKExist, cronInfos
      timezoneData = timezoneData.data[0]
      if (await checkValidTz(timezoneData.timezone) === false) {

        return res.send({ status: 0, response: `${timezoneData.timezone} is not valid timezone` });
      }
      if (cronInfo.length === 0) {

        return res.send({ status: 0, response: `Active job's count looks empty, got ${cronInfo.length}` })
      }
      checKExist = await db.findSingleDocument("timezone", { timezone: timezoneData.timezone })
      if (!checKExist) {

        return res.send({ status: 0, response: `No job found for ${timezoneData.timezone}` })
      }
      cronInfos = cronInfo.find(job => job.timezone === timezoneData.timezone);
      if (cronInfos == undefined) {

        return res.send({ status: 0, response: `No job information found for ${timezoneData.timezone} ` })
      }
      jobInfo = cronInfos.cronInfo
      if (jobInfo.running === false) {
        logger.info(`Job already stopped for ${timezoneData.timezone}`)

        return res.send({ status: 1, response: `Job already stopped for ${timezoneData.timezone}` })
      }
      await jobInfo.stop()
      logger.info(`Job stopped for ${cronInfos.timezone}`)

      return res.send({ status: 1, response: `Job stopped for ${cronInfos.timezone}` })
    } catch (error) {
      return res.send(`Error message : ${error.message}`)
    }


  }

  router.startJob = async (req, res) => {
    try {
      let timezoneData = req.body, jobInfo, checKExist, cronInfos
      timezoneData = timezoneData.data[0]
      if (await checkValidTz(timezoneData.timezone) === false) {

        return res.send({ status: 0, response: `${timezoneData.timezone} is not valid timezone` });
      }
      if (cronInfo.length === 0) {

        return res.send({ status: 0, response: `Active job's count looks empty, got ${cronInfo.length}` })
      }
      checKExist = await db.findSingleDocument("timezone", { timezone: timezoneData.timezone })
      if (!checKExist) {

        return res.send({ status: 0, response: `No job found for ${timezoneData.timezone}` })
      }
      cronInfos = cronInfo.find(job => job.timezone === timezoneData.timezone);
      if (cronInfos == undefined) {

        return res.send({ status: 0, response: `No job information found for ${timezoneData.timezone} ` })
      }
      jobInfo = cronInfos.cronInfo
      if (jobInfo.running === true) {
        logger.info(`Job already running for ${timezoneData.timezone}`)

        return res.send({ status: 1, response: `Job already running for ${timezoneData.timezone}` })
      }
      await jobInfo.start()
      logger.info(`Job started for ${cronInfos.timezone}`)

      return res.send({ status: 1, response: `Job started for ${cronInfos.timezone}` })
    } catch (error) {
      return res.send(`Error message : ${error.message}`)
    }
  }

  return router
}
