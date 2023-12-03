'use strict'
//Imports
const db = require('./mongodb')
const logger = require("./logger")(__filename)
const momentTimezone = require('moment-timezone')
const cron = require('cron').CronJob
const { filterValidTz } = require('./common')
const { schedulerReportMail, scheduleNotFoundMail } = require("./mail")
let cronInfo = []

new cron(`00 30 09 * * *`, async () => {                   //Email Alert At: 9:30 AM Asia/Kolkata         
    try {
        let now, startDate, endDate, ScheduleCutoffData, obj, inputFormat, outputMoment, inputMoment;

        now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 30, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30, 0, 0);

        ScheduleCutoffData = await db.findAndSelect("joblog",
            {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            }, { scheduleInfo: 1, timezone: 1, currentTimeIN: 1 });

        if (ScheduleCutoffData.length !== 0) {
            ScheduleCutoffData = await ScheduleCutoffData.map((data) => {
                obj = {}
                obj.timezone = data.timezone
                obj.scheduleInfo = data.scheduleInfo
                inputFormat = momentTimezone.ISO_8601;
                inputMoment = momentTimezone(data.currentTimeIN, inputFormat);
                outputMoment = inputMoment.tz('Asia/Kolkata');
                obj.currentTimeIN = outputMoment.format('YYYY-MM-DD , LTS');
                return obj
            }
            )
            await schedulerReportMail({
                ScheduleCutoffData: ScheduleCutoffData
            })

            return;
        } else {
            await scheduleNotFoundMail()

            return;
        }
    } catch (error) {
        logger.error(`Error in cron model -emailAlertCron : ${error.message}`)
    }
},
    null,
    true,
    "Asia/Kolkata",
);

const createNewJobs = async (timezone) => {                     // Cron job for newly added timezone
    try {
        let countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus, tracking,
            scheduleIds, schedule_id, getJobInfo, data, currentTimeOC, startsAt, scheduleInfo, endsAt

        data = "Invalid request"

        if (timezone === undefined || timezone === null) {

            return
        }

        getJobInfo = new cron(`00 00 00 * * *`, async () => {
            try {
                startsAt = momentTimezone.tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                currentTimeOC = momentTimezone.tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                countryData = await db.findSingleDocument("country", { timezone: timezone }, { _id: 1 })
                laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                currentTime = momentTimezone.tz(timezone).format('YYYY-MM-DDT23:59:00.000+00:00')
                scheduleCondition = {
                    $and: [
                        { "pol": { $in: laneData } },
                        { 'status': 1 },
                        {
                            'bookingCutOff': { $lte: Date(currentTime) },
                        },
                    ],
                }
                scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1, scheduleId: 1, bookingCutOff: 1 })
                if (scheduleData && scheduleData.length !== 0) {
                    schedule_id = scheduleData.map(e => e._id)
                    scheduleIds = scheduleData.map(e => e.scheduleId)
                    scheduleInfo = scheduleData.map(e => { return { "scheduleId": e.scheduleId, "bookingCutOff": e.bookingCutOff } })

                    updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                    if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                        logger.info(`Schedule Expired For - ${timezone} -to ScheduleIds - ${scheduleIds}`)
                        endsAt = momentTimezone.tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                        tracking = {
                            scheduleInfo: scheduleInfo,
                            timezone: timezone,
                            startsAt: startsAt,
                            endsAt: endsAt,
                            currentTimeIN: startsAt,
                            currentTimeOC: currentTimeOC
                        }
                        await db.insertSingleDocument("joblog", tracking)

                        return;
                    }
                }

                logger.info(`Schedule Expired For - ${timezone} -No schedule Found`)
            } catch (error) {
                logger.error(`Error in cron model -scheduleJob : ${error.message}`)
            }
        },
            null,
            true,
            `${timezone}`,
        );
        if (getJobInfo) {
            logger.info(`New Job successfully added for ${getJobInfo.cronTime.zone} `)
            cronInfo.push({ timezone: timezone, cronInfo: getJobInfo })

            return
        }

        logger.error(data)
    } catch (error) {
        logger.error('Error creating new timezone:', error.message);
    }
};
const scheduleJob = async () => {                       // Cron job for existed timezones in db
    try {
        let countryData, laneData, scheduleCondition, scheduleData, currentTime, data, updateScheduleStatus, tracking,
            scheduleIds, schedule_id, validTimezones, timezoneList, startsAt, endsAt, scheduleInfo, currentTimeOC, getJobInfo

        data = "Invalid request"

        timezoneList = await db.getDistinctValues("country", "timezone")
        validTimezones = await filterValidTz(timezoneList)

        if (validTimezones.length !== 0) {
            validTimezones.map((IANA) => {

                getJobInfo = new cron(`00 00 00 * * *`, async () => {
                    try {
                        startsAt = momentTimezone.tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                        currentTimeOC = momentTimezone.tz(IANA.timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                        countryData = await db.findSingleDocument("country", { timezone: IANA.timezone }, { _id: 1 })
                        laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                        currentTime = momentTimezone.tz(IANA.timezone).format('YYYY-MM-DDT23:59:00.000+00:00')
                        scheduleCondition = {
                            $and: [
                                { "pol": { $in: laneData } },
                                { 'status': 1 },
                                {
                                    'bookingCutOff': { $lte: Date(currentTime) },
                                },
                            ],
                        }
                        scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1, scheduleId: 1, bookingCutOff: 1 })
                        if (scheduleData && scheduleData.length !== 0) {
                            schedule_id = scheduleData.map(e => e._id)
                            scheduleIds = scheduleData.map(e => e.scheduleId)
                            scheduleInfo = scheduleData.map(e => { return { "scheduleId": e.scheduleId, "bookingCutOff": e.bookingCutOff } })

                            updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                            if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                                logger.info(`Schedule Expired For - ${IANA.timezone} -to ScheduleIds - ${scheduleIds}`)
                                endsAt = momentTimezone.tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                                tracking = {
                                    scheduleInfo: scheduleInfo,
                                    timezone: IANA.timezone,
                                    startsAt: startsAt,
                                    endsAt: endsAt,
                                    currentTimeIN: startsAt,
                                    currentTimeOC: currentTimeOC
                                }
                                await db.insertSingleDocument("joblog", tracking)

                                return;
                            }
                        }
                        logger.info(`Schedule Expired For - ${IANA.timezone} -No schedule Found`)
                    } catch (error) {
                        logger.error(`Error in cron model -scheduleJob : ${error.message}`)
                    }
                },
                    null,
                    true,
                    `${IANA.timezone}`,
                );
                if (getJobInfo) {
                    logger.info(`Job successfully added for ${getJobInfo.cronTime.zone} `)
                    cronInfo.push({ timezone: IANA.timezone, cronInfo: getJobInfo })

                    return
                }
            })

            return
        }
        if (validTimezones.length === 0) {
            logger.info(`No timezone found`)

            return
        }
        logger.error(data)
    } catch (error) {
        logger.error(`Error in cron model -scheduleJob : ${error.message}`)
    }
}


scheduleJob()

module.exports = {
    createNewJobs,
    cronInfo
}
