'use strict';

var express = require("express");
var router = express.Router();
var geofenceController = require("./geofence.controller")

router.get('/', geofenceController.index);
router.get('/getactivities', geofenceController.getAllActivities);
router.post('/', geofenceController.create);
router.put('/:id', geofenceController.update);
router.put('/delete/:id', geofenceController.delete);

module.exports = router;