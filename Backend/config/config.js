const path = require('path')
const fs = require('fs')
require("dotenv").config()
let config = JSON.parse(fs.readFileSync(path.join(__dirname, "/config.json"), 'utf8'))
let CONFIG = {}
CONFIG.SMTP_HOST = process.env.SMTP_HOST
CONFIG.SMTP_PORT = process.env.SMTP_PORT
CONFIG.SMTP_AUTH = { user: process.env.SMTP_AUTH_USER, pass: process.env.SMTP_AUTH_PW }
CONFIG.ENV = (process.env.NODE_ENV || 'development');
CONFIG.PORT = config.port
CONFIG.DB_URL = 'mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database + '?authSource=admin';
CONFIG.DB_URL2 = 'mongodb://' + config.mongodb2.username + ':' + config.mongodb2.password + '@' + config.mongodb2.host + ':' + config.mongodb2.port + '/' + config.mongodb2.database + '?authSource=admin';
CONFIG.RMQ = `amqp://${config.rabbitmq.username}:${config.rabbitmq.password}@${config.rabbitmq.host}:${config.rabbitmq.port}`
CONFIG.QUEUE = config.rmqQueue.schedulerQueue

module.exports = CONFIG
