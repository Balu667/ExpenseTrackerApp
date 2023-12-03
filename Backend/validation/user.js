//Imports
const { check, validationResult } = require('express-validator')

//User Validation
module.exports = function (app, io) {
    let data = { status: 0, response: 'Invalid Request' }, validator = {}

    validator.registerUser =
        [         
            check('fullName').trim().notEmpty().withMessage('fullName cannot be empty').matches(/[A-Za-z\s]+$/).withMessage('Fullname should be only letters'),
            check('email').trim().notEmpty().isEmail().withMessage('Enter Valid emailID'),
            check('password').trim().notEmpty().withMessage('Password cannot be empty'),
            (req, res, next) => {
                const errors = validationResult(req).array()
                if (errors.length > 0) {

                    return res.send({ status: 0, response: errors[0].msg })
                }

                return next()
            }
        ]

    validator.loginUser =
        [
            check('email').trim().notEmpty().isEmail().withMessage('User Name or Password is Invalid'),
            check('password').trim().notEmpty().withMessage('Password cannot be empty'),
            (req, res, next) => {
                const errors = validationResult(req).array()
                if (errors.length > 0) {

                    return res.send({ status: 0, response: errors[0].msg })
                }

                return next()
            }
        ]

        validator.insertProduct =
        [
            // check('image').notEmpty().isEmail().withMessage('image cannot be empty'),
            check('name').trim().notEmpty().withMessage('name cannot be empty'),
            check('description').trim().notEmpty().withMessage('description cannot be empty'),
            check('minBidAmount').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('startTime').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('endTime').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('createdBy').notEmpty().withMessage('minBidAmount cannot be empty').isMongoId().withMessage("Invalid createdBy"),
            (req, res, next) => {
                const errors = validationResult(req).array()
                if (errors.length > 0) {

                    return res.send({ status: 0, response: errors[0].msg })
                }

                return next()
            }
        ]

        validator.updateProduct =
        [
            check('id').notEmpty().withMessage('id cannot be empty').isMongoId().withMessage("Invalid id"),
            check('name').trim().notEmpty().withMessage('name cannot be empty'),
            check('description').trim().notEmpty().withMessage('description cannot be empty'),
            check('minBidAmount').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('startTime').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('endTime').notEmpty().withMessage('minBidAmount cannot be empty'),
            check('createdBy').notEmpty().withMessage('minBidAmount cannot be empty').isMongoId().withMessage("Invalid createdBy"),
            (req, res, next) => {
                const errors = validationResult(req).array()
                if (errors.length > 0) {

                    return res.send({ status: 0, response: errors[0].msg })
                }

                return next()
            }
        ]

        validator.deleteProduct =
        [
            check('id').notEmpty().withMessage('id cannot be empty').isMongoId().withMessage("Invalid id"),
            (req, res, next) => {
                const errors = validationResult(req).array()
                if (errors.length > 0) {

                    return res.send({ status: 0, response: errors[0].msg })
                }

                return next()
            }
        ]

        

    return validator;
}