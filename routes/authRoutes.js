const express = require('express');
const router = express.Router();
const controller = require('../controller/authController');
const asyncHandler = require('../utils/asyncHandler');
const loginLimiter = require('../middleware/loginLimiter')

router.post(
    '/login',
    loginLimiter
    ,asyncHandler(controller.login)
);

module.exports = router;