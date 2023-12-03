const amqp = require('amqplib');
const { createNewJobs } = require('./cron');
const logger = require("./logger")(__filename);
const CONFIG = require("../config/config");
const { checKExist, checkValidTz } = require('./common');

let channel, message, connection, connectToRabbitMQ, receiveMessage

connectToRabbitMQ = async () => {
    try {
        connection = await amqp.connect(CONFIG.RMQ);
        channel = await connection.createChannel();
        if (channel) {
            logger.info('RabbitMq connected successfully');

            return channel
        }
    } catch (error) {
        logger.error('Error connecting to RabbitMQ:', error.message);
    }
};


//common Function for RabbitMQ Send Message
receiveMessage = async (queueName) => {
    try {
        channel = await connectToRabbitMQ()
        if (channel === undefined) {
            logger.error(`Error Receiving message from RMQ`)

            return
        }
        await channel.assertQueue(queueName, { durable: true })
        await channel.consume(queueName, async (data) => {
            if (data !== null || data !== undefined) {
                message = data.content.toString();
                message = JSON.parse(message)
                if (message) {
                    logger.info(`Received timezone ${message} from RMQ`)

                    if (await checkValidTz(message) === false) {
                        logger.error(`Invalid timezone added ${message}`);
                        await channel.ack(data)

                        return
                    }

                    if (await checKExist(message) === true) {
                        logger.error(`Timezone already added for IANA ${message}`)
                        await channel.ack(data)

                        return
                    }
                    await createNewJobs(message)
                    await channel.ack(data)

                    return
                }
                await channel.ack(data)

                return
            }
        },
            { noAck: false })
    } catch (error) {
        logger.error(`Error reciving message from RMQ ${error.message}`)
    }

};

receiveMessage(CONFIG.QUEUE)

