//Imports
const logger = require("../model/logger")(__filename)
const scheduler = require("../controllers/scheduler")()
module.exports = (app) => {
    try {

        app.get("/schedulerAm", scheduler.amScheduler)
        app.post("/stopJob",scheduler.stopJob)
        app.post("/startJob",scheduler.startJob)

    } catch (e) {
        logger.error(`Error in user route: ${e.message}`)
    }
};