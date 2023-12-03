const logger = require("./logger")(__filename)
const nodemailer = require('nodemailer')
const CONFIG = require('../config/config.js')
const ejs = require("ejs")

const transporter = nodemailer.createTransport({
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    auth: CONFIG.SMTP_AUTH
})

const schedulerReportMail = async (mailData) => {
    let schedulerReportMailTo = JSON.parse(process.env.schedulerReportMailTo)

    ejs.renderFile('./templates/scheduleExpiryReport.ejs',
        {
            ScheduleCutoffData: mailData.ScheduleCutoffData,
            linkdinUrl: process.env.LINKDINURL,
            instaUrl: process.env.INSTAURL
        }
        , (err, data) => {
            if (err) {
                logger.info(`Error in sending schedule alert mail, with schedules : ${err}`)
            } else {
                let mailOptions = {
                    from: process.env.SMTP_AUTH_USER,
                    to: schedulerReportMailTo,
                    subject: `AllMasters Scheduler Reports`,
                    html: data
                }

                //Send Mail
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        if (mailResendAttempts !== 0) {
                            schedulerReportMail(mailData)
                            mailResendAttempts--
                        } else {
                            mailResendAttempts = 2
                        }
                        logger.error(`schedulerReport Mail Not Sent - ${error}`)
                        return console.log(error)
                    }

                    logger.info(`schedulerReport Mail sent:  - ${info.messageId}`)
                })
            }
        })


}

const scheduleNotFoundMail = async () => {
    let schedulerReportMailTo = JSON.parse(process.env.schedulerReportMailTo)

    ejs.renderFile('./templates/notfoundReport.ejs',
        {
            linkdinUrl: process.env.LINKDINURL,
            instaUrl: process.env.INSTAURL
        }
        , (err, data) => {
            if (err) {
                logger.info(`Error in sending schedule alert mail, wihtout schedules : ${err}`)
            } else {
                let mailOptions = {
                    from: process.env.SMTP_AUTH_USER,
                    to: schedulerReportMailTo,
                    subject: `AllMasters Scheduler Reports`,
                    html: data
                }

                //Send Mail
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        if (mailResendAttempts !== 0) {
                            scheduleNotFoundMail()
                            mailResendAttempts--
                        } else {
                            mailResendAttempts = 2
                        }
                        logger.error(`scheduleNotFound Mail Not Sent - ${error}`)
                        return console.log(error)
                    }

                    logger.info(`scheduleNotFound Mail sent:  - ${info.messageId}`)
                })
            }
        })


}

module.exports = { schedulerReportMail, scheduleNotFoundMail }