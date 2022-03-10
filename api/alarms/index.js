'use strict';

var express = require("express");
var router = express.Router();
var alarmController = require("./alarm.controller")

router.get('/', alarmController.index);
router.get('/getactivities', alarmController.getAllActivities);
router.post('/', alarmController.create);
router.put('/:id', alarmController.update);
router.put('/delete/:id', alarmController.delete);

module.exports = router;